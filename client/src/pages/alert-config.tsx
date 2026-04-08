import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell, Mic, MessageSquare, MapPin, Save, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import SentinelFooter from "@/components/sentinel-footer";
import type { AlertSetting } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const levelConfig: Record<number, { label: string; color: string; description: string; defaultPhrase: string; defaultMessage: string }> = {
  1: {
    label: "Level 1 - Emergency",
    color: "#ff4444",
    description: "Maximum alert - contacts emergency services plus all your contacts",
    defaultPhrase: "Help me now",
    defaultMessage: "EMERGENCY ALERT: I need immediate help. This is an automated message from Sentinel Dynamic.",
  },
  2: {
    label: "Level 2 - Trusted",
    color: "#a855f7",
    description: "Alert trusted contacts only",
    defaultPhrase: "I need help",
    defaultMessage: "ALERT: I may be in danger. Please check on me. This is an automated message from Sentinel Dynamic.",
  },
  3: {
    label: "Level 3 - General",
    color: "#00d4aa",
    description: "Alert general support network",
    defaultPhrase: "Send message",
    defaultMessage: "NOTICE: I wanted you to know my current location. This is an automated message from Sentinel Dynamic.",
  },
};

interface FormDataLevel {
  id?: number;
  activationPhrase: string;
  messageTemplate: string;
  includeLocation: boolean;
  countryEmergencyNumber?: string;
}

export default function AlertConfigPage() {
  const [savedLevels, setSavedLevels] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const { data: alertSettings = [], isLoading } = useQuery<AlertSetting[]>({
    queryKey: ["/api/alert-settings"],
  });

  const [formData, setFormData] = useState<Record<number, FormDataLevel>>({
    1: { activationPhrase: "", messageTemplate: "", includeLocation: true, countryEmergencyNumber: "911" },
    2: { activationPhrase: "", messageTemplate: "", includeLocation: true },
    3: { activationPhrase: "", messageTemplate: "", includeLocation: true },
  });

  useEffect(() => {
    if (alertSettings.length > 0) {
      const newFormData = { ...formData };
      alertSettings.forEach((s) => {
        newFormData[s.level] = {
          id: s.id,
          activationPhrase: s.activationPhrase,
          messageTemplate: s.messageTemplate,
          includeLocation: s.includeLocation ?? true,
          countryEmergencyNumber: s.countryEmergencyNumber || "911",
        };
      });
      setFormData(newFormData);
    }
  }, [alertSettings]);

  const saveMutation = useMutation({
    mutationFn: async ({ level, data }: { level: number; data: any }) => {
      const existing = alertSettings.find((s) => s.level === level);
      if (existing) {
        const res = await apiRequest("PATCH", `/api/alert-settings/${existing.id}`, { ...data, level });
        return res.json();
      }
      const res = await apiRequest("POST", "/api/alert-settings", { ...data, level });
      return res.json();
    },
    onSuccess: (_, { level }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/alert-settings"] });
      setSavedLevels((p) => ({ ...p, [level]: true }));
      setTimeout(() => setSavedLevels((p) => ({ ...p, [level]: false })), 2000);
      toast({ title: "Settings saved" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateField = (level: number, field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [level]: { ...prev[level], [field]: value } }));
  };

  const handleSave = (level: number) => {
    saveMutation.mutate({
      level,
      data: {
        activationPhrase: formData[level].activationPhrase || levelConfig[level].defaultPhrase,
        messageTemplate: formData[level].messageTemplate || levelConfig[level].defaultMessage,
        includeLocation: formData[level].includeLocation,
        ...(level === 1 && { countryEmergencyNumber: formData[1].countryEmergencyNumber }),
      },
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="font-cinzel text-2xl text-foreground tracking-[0.2em] flex items-center gap-3" data-testid="text-alert-config-title">
                <Bell className="w-6 h-6 text-primary" />
                ALERT CONFIGURATION
              </h1>
            </div>

            <div className="mb-8 p-4 border-2 border-primary/30 bg-primary/5">
              <div className="flex items-start gap-3">
                <Mic className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-primary font-cinzel text-sm tracking-wide">VOICE RECOGNITION</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Choose clear, distinct phrases that you can say naturally but would not use in normal conversation.
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 w-full" />)}
              </div>
            ) : (
              <div className="space-y-6">
                {[1, 2, 3].map((level) => (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: level * 0.1 }}
                    className="bg-card border-2 border-border p-6"
                    data-testid={`card-alert-level-${level}`}
                  >
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4" style={{ backgroundColor: levelConfig[level].color }} />
                        <div>
                          <h2 className="font-cinzel text-lg tracking-wider" style={{ color: levelConfig[level].color }}>
                            {levelConfig[level].label.toUpperCase()}
                          </h2>
                          <p className="text-muted-foreground text-xs">{levelConfig[level].description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSave(level)}
                        className="rounded-none font-cinzel tracking-wider px-6"
                        disabled={saveMutation.isPending}
                        data-testid={`button-save-level-${level}`}
                      >
                        {savedLevels[level] ? (
                          <><Check className="w-4 h-4 mr-2" />SAVED</>
                        ) : (
                          <><Save className="w-4 h-4 mr-2" />SAVE</>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-muted-foreground text-xs font-cinzel tracking-wider mb-2">
                          <Mic className="w-4 h-4" />ACTIVATION PHRASE
                        </label>
                        <Input
                          value={formData[level].activationPhrase}
                          onChange={(e) => updateField(level, "activationPhrase", e.target.value)}
                          placeholder={levelConfig[level].defaultPhrase}
                          className="rounded-none"
                          data-testid={`input-phrase-${level}`}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-muted-foreground text-xs font-cinzel tracking-wider mb-2">
                          <MessageSquare className="w-4 h-4" />MESSAGE TEMPLATE
                        </label>
                        <Textarea
                          value={formData[level].messageTemplate}
                          onChange={(e) => updateField(level, "messageTemplate", e.target.value)}
                          placeholder={levelConfig[level].defaultMessage}
                          className="rounded-none min-h-[100px]"
                          data-testid={`input-message-${level}`}
                        />
                      </div>
                      {level === 1 && (
                        <div>
                          <label className="flex items-center gap-2 text-muted-foreground text-xs font-cinzel tracking-wider mb-2">
                            <AlertTriangle className="w-4 h-4" />EMERGENCY NUMBER
                          </label>
                          <Input
                            value={formData[1].countryEmergencyNumber || ""}
                            onChange={(e) => updateField(1, "countryEmergencyNumber", e.target.value)}
                            placeholder="911"
                            className="rounded-none max-w-xs"
                            data-testid="input-emergency-number"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm font-cinzel tracking-wide">INCLUDE GPS LOCATION</span>
                        </div>
                        <Switch
                          checked={formData[level].includeLocation}
                          onCheckedChange={(v) => updateField(level, "includeLocation", v)}
                          data-testid={`switch-location-${level}`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
        <SentinelFooter />
      </div>
    </ScrollArea>
  );
}
