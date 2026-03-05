import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, Play, Pause, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SentinelFooter from "@/components/sentinel-footer";
import type { CheckInTimer } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const presetDurations = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
];

export default function CheckInPage() {
  const [duration, setDuration] = useState(60);
  const [alertLevel, setAlertLevel] = useState(2);
  const [customMessage, setCustomMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: timers = [], isLoading } = useQuery<CheckInTimer[]>({
    queryKey: ["/api/checkin-timers"],
  });

  const activeTimer = timers.find((t) => t.isActive);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (timers.length > 0) {
        const res = await apiRequest("PATCH", `/api/checkin-timers/${timers[0].id}`, data);
        return res.json();
      }
      const res = await apiRequest("POST", "/api/checkin-timers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checkin-timers"] });
      toast({ title: "Timer updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!activeTimer?.checkInBy) {
      setTimeRemaining(null);
      return;
    }
    const update = () => {
      const diff = new Date(activeTimer.checkInBy!).getTime() - Date.now();
      setTimeRemaining(diff <= 0 ? 0 : Math.floor(diff / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (s: number | null) => {
    if (s === null) return "--:--:--";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const isExpired = timeRemaining !== null && timeRemaining <= 0;

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-cinzel text-2xl text-foreground tracking-[0.2em] mb-2" data-testid="text-checkin-title">
                CHECK-IN TIMER
              </h1>
              <p className="text-muted-foreground text-sm">Auto-alert if you do not check in by deadline</p>
            </div>

            {isLoading ? (
              <Skeleton className="h-64 w-full mb-8" />
            ) : (
              <>
                <div
                  className={
                    "bg-card border-4 p-8 text-center mb-8 " +
                    (isExpired
                      ? "border-destructive"
                      : activeTimer
                      ? "border-primary"
                      : "border-border")
                  }
                  data-testid="card-timer-display"
                >
                  <Clock
                    className={
                      "w-12 h-12 mx-auto mb-4 " +
                      (isExpired
                        ? "text-destructive"
                        : activeTimer
                        ? "text-primary"
                        : "text-muted-foreground")
                    }
                  />
                  <div
                    className={
                      "font-mono text-5xl mb-4 " +
                      (isExpired ? "text-destructive" : "text-foreground")
                    }
                    data-testid="text-timer-display"
                  >
                    {formatTime(timeRemaining)}
                  </div>
                  {activeTimer && (
                    <p className={"text-sm " + (isExpired ? "text-destructive" : "text-muted-foreground")}>
                      {isExpired ? "TIMER EXPIRED" : "Time remaining to check in"}
                    </p>
                  )}
                  {!activeTimer && <p className="text-muted-foreground text-sm">No active timer</p>}
                </div>

                {activeTimer ? (
                  <div className="space-y-4">
                    <Button
                      onClick={() =>
                        saveMutation.mutate({
                          checkInBy: new Date(Date.now() + (activeTimer.durationMinutes || duration) * 60000).toISOString(),
                          lastCheckIn: new Date().toISOString(),
                          isActive: true,
                          durationMinutes: activeTimer.durationMinutes || duration,
                          alertLevel: activeTimer.alertLevel,
                          customMessage: activeTimer.customMessage,
                        })
                      }
                      className="w-full py-6 font-cinzel tracking-widest text-lg rounded-none"
                      disabled={saveMutation.isPending}
                      data-testid="button-checkin-now"
                    >
                      <CheckCircle className="w-6 h-6 mr-3" />
                      CHECK IN NOW
                    </Button>
                    <Button
                      onClick={() =>
                        saveMutation.mutate({
                          isActive: false,
                          checkInBy: activeTimer.checkInBy,
                          durationMinutes: activeTimer.durationMinutes,
                          alertLevel: activeTimer.alertLevel,
                          customMessage: activeTimer.customMessage,
                        })
                      }
                      variant="outline"
                      className="w-full py-4 border-2 border-destructive text-destructive font-cinzel tracking-wider rounded-none"
                      disabled={saveMutation.isPending}
                      data-testid="button-stop-timer"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      STOP TIMER
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card border-2 border-border p-6 space-y-6">
                    <div>
                      <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">DURATION</label>
                      <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                        <SelectTrigger className="rounded-none" data-testid="select-duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {presetDurations.map((d) => (
                            <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">ALERT LEVEL IF MISSED</label>
                      <Select value={String(alertLevel)} onValueChange={(v) => setAlertLevel(Number(v))}>
                        <SelectTrigger className="rounded-none" data-testid="select-alert-level">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1 - Emergency</SelectItem>
                          <SelectItem value="2">Level 2 - Trusted</SelectItem>
                          <SelectItem value="3">Level 3 - General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-muted-foreground text-xs font-cinzel tracking-wider mb-2">CUSTOM MESSAGE (OPTIONAL)</label>
                      <Input
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="I haven't checked in. Please check on me."
                        className="rounded-none"
                        data-testid="input-custom-message"
                      />
                    </div>
                    <Button
                      onClick={() =>
                        saveMutation.mutate({
                          isActive: true,
                          checkInBy: new Date(Date.now() + duration * 60000).toISOString(),
                          durationMinutes: duration,
                          alertLevel,
                          customMessage: customMessage || "I haven't checked in. Please check on me.",
                        })
                      }
                      className="w-full py-6 font-cinzel tracking-widest text-lg rounded-none"
                      disabled={saveMutation.isPending}
                      data-testid="button-start-timer"
                    >
                      <Play className="w-6 h-6 mr-3" />
                      START TIMER
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <SentinelFooter />
      </div>
    </ScrollArea>
  );
}
