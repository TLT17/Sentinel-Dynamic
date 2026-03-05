import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAlertSchema } from "@shared/schema";
import type { Alert, InsertAlert } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Bell,
  BellOff,
  Clock,
  Cloud,
  ShieldAlert,
  Heart,
  Flame,
  Info,
} from "lucide-react";

function alertTypeIcon(type: string) {
  switch (type) {
    case "weather": return Cloud;
    case "security": return ShieldAlert;
    case "health": return Heart;
    case "fire": return Flame;
    default: return Info;
  }
}

function severityColor(severity: string) {
  switch (severity) {
    case "critical": return "destructive" as const;
    case "high": return "destructive" as const;
    case "medium": return "secondary" as const;
    case "low": return "outline" as const;
    default: return "secondary" as const;
  }
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Alerts() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const form = useForm<InsertAlert>({
    resolver: zodResolver(insertAlertSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "general",
      severity: "medium",
      active: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAlert) => {
      const res = await apiRequest("POST", "/api/alerts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      setOpen(false);
      form.reset();
      toast({ title: "Alert created", description: "New alert has been broadcast." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const res = await apiRequest("PATCH", `/api/alerts/${id}`, { active });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });

  const activeAlerts = alerts?.filter((a) => a.active) || [];
  const inactiveAlerts = alerts?.filter((a) => !a.active) || [];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-alerts-title">Alerts</h1>
            <p className="text-muted-foreground mt-1">Manage safety alerts and notifications</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-alert">
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Alert title" data-testid="input-alert-title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Alert details" data-testid="input-alert-message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-alert-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weather">Weather</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                              <SelectItem value="health">Health</SelectItem>
                              <SelectItem value="fire">Fire</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-alert-severity">
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-alert">
                    {createMutation.isPending ? "Creating..." : "Create Alert"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <>
            {activeAlerts.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Alerts ({activeAlerts.length})
                </h2>
                {activeAlerts.map((alert) => {
                  const TypeIcon = alertTypeIcon(alert.type);
                  return (
                    <Card key={alert.id} data-testid={`card-alert-detail-${alert.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 shrink-0">
                              <TypeIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm">{alert.title}</h3>
                                <Badge variant={severityColor(alert.severity)}>
                                  {alert.severity}
                                </Badge>
                                <Badge variant="outline">{alert.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{alert.message}</p>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {formatDate(alert.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Switch
                              checked={alert.active}
                              onCheckedChange={(active) =>
                                toggleMutation.mutate({ id: alert.id, active })
                              }
                              data-testid={`switch-alert-${alert.id}`}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {inactiveAlerts.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Dismissed ({inactiveAlerts.length})
                </h2>
                {inactiveAlerts.map((alert) => {
                  const TypeIcon = alertTypeIcon(alert.type);
                  return (
                    <Card key={alert.id} className="opacity-60" data-testid={`card-alert-inactive-${alert.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted shrink-0">
                              <TypeIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-medium text-sm">{alert.title}</h3>
                                <Badge variant="outline">{alert.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{alert.message}</p>
                            </div>
                          </div>
                          <Switch
                            checked={alert.active}
                            onCheckedChange={(active) =>
                              toggleMutation.mutate({ id: alert.id, active })
                            }
                            data-testid={`switch-alert-inactive-${alert.id}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {alerts && alerts.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BellOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No alerts</h3>
                  <p className="text-sm text-muted-foreground mt-1">Create an alert to notify your team</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
