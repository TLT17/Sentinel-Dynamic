import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Activity, ChevronRight, Mic } from "lucide-react";
import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import VoiceActivationControl from "@/components/voice-activation-control";
import LevelIndicator from "@/components/level-indicator";
import SentinelFooter from "@/components/sentinel-footer";
import type { UserPreference, EmergencyContact } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

function VoiceBeepTest() {
  const [testState, setTestState] = useState<"idle" | "listening" | "detected" | "error">("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playBeep = useCallback(() => {
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
  }, []);

  const stopTest = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  const startTest = useCallback(async () => {
    if (testState === "listening") { stopTest(); setTestState("idle"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setTestState("listening");

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let detected = false;

      intervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        if (avg > 18 && !detected) {
          detected = true;
          playBeep();
          setTestState("detected");
          stopTest();
          audioCtx.close();
          setTimeout(() => setTestState("idle"), 2500);
        }
      }, 80);

      timeoutRef.current = setTimeout(() => {
        if (!detected) { stopTest(); audioCtx.close(); setTestState("idle"); }
      }, 6000);
    } catch {
      setTestState("error");
      setTimeout(() => setTestState("idle"), 3000);
    }
  }, [testState, playBeep, stopTest]);

  const label = testState === "idle" ? "VOICE / BEEP TEST"
    : testState === "listening" ? "LISTENING... SPEAK NOW"
    : testState === "detected" ? "DETECTED — BEEP PLAYED"
    : "MICROPHONE ACCESS DENIED";

  const borderColor = testState === "detected" ? "border-primary text-primary"
    : testState === "listening" ? "border-blue-500 text-blue-500"
    : testState === "error" ? "border-destructive text-destructive"
    : "border-border text-muted-foreground";

  return (
    <motion.button
      onClick={startTest}
      whileTap={{ scale: 0.97 }}
      className={"mt-4 w-full p-4 border-2 bg-card flex items-center justify-between transition-all duration-200 hover-elevate " + borderColor}
      data-testid="button-voice-beep-test"
    >
      <div className="flex items-center gap-3">
        <Mic className={"w-5 h-5 " + (testState === "listening" ? "animate-pulse" : "")} />
        <span className="font-cinzel tracking-wide text-sm">{label}</span>
      </div>
      {testState === "idle" && <ChevronRight className="w-4 h-4 text-primary" />}
      {testState === "listening" && <span className="text-xs font-cinzel opacity-60">TAP TO STOP</span>}
    </motion.button>
  );
}

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
                    {currentPrefs.systemArmed ? "LISTENING MODE" : "STANDBY MODE"}
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

            <VoiceBeepTest />

          </div>
        </main>
        <SentinelFooter />
      </div>
    </ScrollArea>
  );
}
