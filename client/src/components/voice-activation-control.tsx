import { useState, useCallback } from "react";
import { Shield, ShieldOff, Mic, Wifi, WifiOff, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceActivationControlProps {
  isArmed: boolean;
  onToggle: () => void;
  decoyMode: boolean;
}

export default function VoiceActivationControl({ isArmed, onToggle, decoyMode }: VoiceActivationControlProps) {
  const [lastDetection, setLastDetection] = useState<Date | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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
      setLastDetection(new Date());
    } catch (e) { /* audio context unavailable */ }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.button
        onClick={onToggle}
        className={
          "relative w-48 h-48 border-4 flex flex-col items-center justify-center transition-all duration-500 " +
          (isArmed
            ? "border-primary bg-primary/10 shadow-[0_0_60px_rgba(0,212,170,0.2)]"
            : "border-muted bg-muted")
        }
        whileTap={{ scale: 0.95 }}
        data-testid="button-arm-toggle"
      >
        <AnimatePresence>
          {isArmed && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-2 border-primary"
            />
          )}
        </AnimatePresence>
        {isArmed ? (
          <Shield className="w-20 h-20 text-primary" />
        ) : (
          <ShieldOff className="w-20 h-20 text-muted-foreground" />
        )}
        <span
          className={
            "font-cinzel text-lg mt-4 tracking-widest " +
            (isArmed ? "text-primary" : "text-muted-foreground")
          }
        >
          {isArmed ? "SENTINEL ON" : "SENTINEL OFF"}
        </span>
      </motion.button>

      <div className="flex items-center gap-4 mt-6 flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <Mic className={"w-5 h-5 " + (isArmed || decoyMode ? "text-primary" : "text-muted-foreground")} />
          <span className="text-sm text-muted-foreground font-cinzel">VOICE</span>
          <div className={"w-2 h-2 " + (isArmed || decoyMode ? "bg-primary" : "bg-muted-foreground")} />
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className={"w-5 h-5 " + (decoyMode ? "text-primary" : "text-muted-foreground")} />
          <span className="text-sm text-muted-foreground font-cinzel">DECOY</span>
          <div className={"w-2 h-2 " + (decoyMode ? "bg-primary" : "bg-muted-foreground")} />
        </div>
        <div className="flex items-center gap-2">
          {isOffline ? (
            <WifiOff className="w-5 h-5 text-purple-400" />
          ) : (
            <Wifi className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm text-muted-foreground font-cinzel">{isOffline ? "OFFLINE" : "ONLINE"}</span>
          <div className={"w-2 h-2 " + (isOffline ? "bg-purple-400" : "bg-primary")} />
        </div>
      </div>

      {!isArmed && decoyMode && (
        <div className="mt-4 p-3 border border-primary/30 bg-primary/5 max-w-xs">
          <p className="text-xs text-primary text-center font-cinzel tracking-wide">DECOY MODE ACTIVE</p>
          <p className="text-xs text-muted-foreground text-center mt-1">Beep sounds on trigger even when disarmed</p>
        </div>
      )}

      {lastDetection && (
        <p className="text-xs text-muted-foreground mt-3 font-cinzel" data-testid="text-last-beep">
          Last beep: {lastDetection.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
