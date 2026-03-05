import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Activity, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import VoiceActivationControl from "@/components/voice-activation-control";
import LevelIndicator from "@/components/level-indicator";
import SentinelFooter from "@/components/sentinel-footer";
import type { UserPreference, EmergencyContact } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function HomePage() {
  const { data: preferences, isLoading: prefsLoading } = useQuery<UserPreference[]>({
    queryKey: ["/api/preferences"],
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/contacts"],
  });

  const currentPrefs = preferences?.[0] || { id: 0, language: "en", systemArmed: false, voiceSensitivity: 0.7, decoyMode: true };

  const toggleMutation = useMutation({
    mutationFn: async (newState: boolean) => {
      if (preferences?.[0]) {
        const res = await apiRequest("PATCH", `/api/preferences/${preferences[0].id}`, { systemArmed: newState });
        return res.json();
      }
      const res = await apiRequest("POST", "/api/preferences", { systemArmed: newState, decoyMode: true, language: "en", voiceSensitivity: 0.7 });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      playBeep();
    },
  });

  const playBeep = () => {
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

  const loading = prefsLoading || contactsLoading;

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-cinzel text-2xl text-foreground tracking-[0.2em] mb-2" data-testid="text-system-status">
                SYSTEM STATUS
              </h1>
              {loading ? (
                <Skeleton className="h-10 w-48 mx-auto" />
              ) : (
                <div
                  className={
                    "inline-flex items-center gap-2 px-4 py-2 border-2 " +
                    (currentPrefs.systemArmed
                      ? "border-primary text-primary"
                      : "border-muted-foreground text-muted-foreground")
                  }
                  data-testid="text-monitoring-status"
                >
                  <Activity className="w-4 h-4" />
                  <span className="font-cinzel tracking-wider text-sm">
                    {currentPrefs.systemArmed ? "MONITORING ACTIVE" : "STANDBY MODE"}
                  </span>
                </div>
              )}
            </motion.div>

            {loading ? (
              <div className="flex justify-center mb-12">
                <Skeleton className="w-48 h-48" />
              </div>
            ) : (
              <div className="flex justify-center mb-12">
                <VoiceActivationControl
                  isArmed={currentPrefs.systemArmed}
                  onToggle={() => toggleMutation.mutate(!currentPrefs.systemArmed)}
                  decoyMode={currentPrefs.decoyMode}
                />
              </div>
            )}

            <div className="mb-8">
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                ALERT LEVELS
              </h2>
              <div className="space-y-3">
                {[1, 2, 3].map((level) => (
                  <LevelIndicator
                    key={level}
                    level={level}
                    contactCount={contacts.filter((c) => c.level === level).length}
                    isActive={false}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/contacts">
                <div className="p-4 border-2 border-border bg-card hover-elevate transition-all flex items-center justify-between cursor-pointer" data-testid="link-manage-contacts">
                  <span className="font-cinzel text-foreground tracking-wide text-sm">MANAGE CONTACTS</span>
                  <ChevronRight className="w-5 h-5 text-primary" />
                </div>
              </Link>
              <Link href="/alerts">
                <div className="p-4 border-2 border-border bg-card hover-elevate transition-all flex items-center justify-between cursor-pointer" data-testid="link-configure-alerts">
                  <span className="font-cinzel text-foreground tracking-wide text-sm">CONFIGURE ALERTS</span>
                  <ChevronRight className="w-5 h-5 text-primary" />
                </div>
              </Link>
            </div>

            {!currentPrefs.systemArmed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-4 border-2 border-yellow-600/50 bg-yellow-600/10"
              >
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-yellow-500 font-cinzel text-sm tracking-wide">SYSTEM DISARMED</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {currentPrefs.decoyMode
                        ? "Decoy mode active - beep sounds will still play on voice detection"
                        : "Enable the system to activate voice monitoring"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
        <SentinelFooter />
      </div>
    </ScrollArea>
  );
}
