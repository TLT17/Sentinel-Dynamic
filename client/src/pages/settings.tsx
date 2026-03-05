import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings as SettingsIcon, Volume2, Mic, Shield, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import SentinelFooter from "@/components/sentinel-footer";
import type { UserPreference } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ decoyMode: true, voiceSensitivity: 0.7 });
  const { toast } = useToast();

  const { data: preferences, isLoading } = useQuery<UserPreference[]>({
    queryKey: ["/api/preferences"],
  });

  useEffect(() => {
    if (preferences?.[0]) {
      setSettings({
        decoyMode: preferences[0].decoyMode ?? true,
        voiceSensitivity: preferences[0].voiceSensitivity ?? 0.7,
      });
    }
  }, [preferences]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (preferences?.[0]) {
        const res = await apiRequest("PATCH", `/api/preferences/${preferences[0].id}`, data);
        return res.json();
      }
      const res = await apiRequest("POST", "/api/preferences", { ...data, language: "en", systemArmed: false });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast({ title: "Settings saved" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const playTestBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 150);
    } catch (e) { /* */ }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h1 className="font-cinzel text-2xl text-foreground tracking-[0.2em] flex items-center gap-3" data-testid="text-settings-title">
                <SettingsIcon className="w-6 h-6 text-primary" />
                SETTINGS
              </h1>
              <Button
                onClick={() => saveMutation.mutate(settings)}
                className="rounded-none font-cinzel tracking-wider px-6"
                disabled={saveMutation.isPending}
                data-testid="button-save-settings"
              >
                {saved ? (
                  <><Check className="w-4 h-4 mr-2" />SAVED</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />SAVE CHANGES</>
                )}
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-card border-2 border-border p-6 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-primary flex items-center justify-center mt-1 shrink-0">
                      <Volume2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-foreground tracking-wider mb-1">DECOY MODE</h3>
                      <p className="text-muted-foreground text-sm max-w-md">
                        When disarmed, still play confirmation beeps to maintain appearance of activation.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.decoyMode}
                    onCheckedChange={(v) => setSettings({ ...settings, decoyMode: v })}
                    data-testid="switch-decoy-mode"
                  />
                </div>

                <div className="bg-card border-2 border-border p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 border-2 border-primary flex items-center justify-center mt-1 shrink-0">
                      <Mic className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-foreground tracking-wider mb-1">VOICE SENSITIVITY</h3>
                      <p className="text-muted-foreground text-sm">Adjust detection sensitivity.</p>
                    </div>
                  </div>
                  <div className="pl-14">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-xs font-cinzel">LOW</span>
                      <span className="text-primary font-cinzel" data-testid="text-sensitivity-value">
                        {Math.round(settings.voiceSensitivity * 100)}%
                      </span>
                      <span className="text-muted-foreground text-xs font-cinzel">HIGH</span>
                    </div>
                    <Slider
                      value={[settings.voiceSensitivity]}
                      onValueChange={([v]) => setSettings({ ...settings, voiceSensitivity: v })}
                      max={1}
                      min={0.3}
                      step={0.05}
                      data-testid="slider-sensitivity"
                    />
                  </div>
                </div>

                <div className="bg-card border-2 border-border p-6 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-primary flex items-center justify-center shrink-0">
                      <Volume2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-foreground tracking-wider mb-1">TEST CONFIRMATION BEEP</h3>
                      <p className="text-muted-foreground text-sm">Play the sound that confirms voice activation</p>
                    </div>
                  </div>
                  <Button
                    onClick={playTestBeep}
                    variant="outline"
                    className="rounded-none font-cinzel tracking-wider"
                    data-testid="button-test-beep"
                  >
                    PLAY BEEP
                  </Button>
                </div>

                <div className="bg-card border-2 border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-primary flex items-center justify-center mt-1 shrink-0">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-foreground tracking-wider mb-1">ABOUT</h3>
                      <p className="text-muted-foreground text-sm">
                        Sentinel Dynamic v1.0 - Voice-activated emergency alert system.
                      </p>
                      <p className="text-muted-foreground/60 text-xs mt-2">
                        Compliant with New Zealand Privacy Act 2020 and Harmful Digital Communications Act 2015
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <SentinelFooter />
      </div>
    </ScrollArea>
  );
}
