import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Bell,
  ShieldCheck,
  Users,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { Incident, Alert, SafetyCheckin, EmergencyContact } from "@shared/schema";

function severityColor(severity: string) {
  switch (severity) {
    case "critical": return "destructive" as const;
    case "high": return "destructive" as const;
    case "medium": return "secondary" as const;
    case "low": return "outline" as const;
    default: return "secondary" as const;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "open": return "destructive" as const;
    case "investigating": return "secondary" as const;
    case "resolved": return "outline" as const;
    case "closed": return "outline" as const;
    default: return "secondary" as const;
  }
}

function formatTime(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading,
}: {
  title: string;
  value: number | string;
  icon: typeof Activity;
  description: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold" data-testid={`text-stat-${title.toLowerCase().replace(/\s/g, '-')}`}>{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: incidents, isLoading: incidentsLoading } = useQuery<Incident[]>({
    queryKey: ["/api/incidents"],
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const { data: checkins, isLoading: checkinsLoading } = useQuery<SafetyCheckin[]>({
    queryKey: ["/api/checkins"],
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/contacts"],
  });

  const loading = incidentsLoading || alertsLoading || checkinsLoading || contactsLoading;

  const openIncidents = incidents?.filter((i) => i.status === "open" || i.status === "investigating") || [];
  const activeAlerts = alerts?.filter((a) => a.active) || [];
  const recentCheckins = checkins?.slice(0, 5) || [];
  const criticalIncidents = incidents?.filter((i) => i.severity === "critical" || i.severity === "high") || [];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-dashboard-title">Safety Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your safety environment</p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Open Incidents"
            value={loading ? "..." : openIncidents.length}
            icon={AlertTriangle}
            description="Requiring attention"
            loading={loading}
          />
          <StatCard
            title="Active Alerts"
            value={loading ? "..." : activeAlerts.length}
            icon={Bell}
            description="Currently active"
            loading={loading}
          />
          <StatCard
            title="Recent Check-ins"
            value={loading ? "..." : (checkins?.length || 0)}
            icon={ShieldCheck}
            description="Safety confirmations"
            loading={loading}
          />
          <StatCard
            title="Emergency Contacts"
            value={loading ? "..." : (contacts?.length || 0)}
            icon={Users}
            description="Registered contacts"
            loading={loading}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Recent Incidents
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {openIncidents.length} open
              </Badge>
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : incidents && incidents.length > 0 ? (
                <div className="space-y-3">
                  {incidents.slice(0, 5).map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-md bg-muted/50"
                      data-testid={`card-incident-${incident.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm truncate">{incident.title}</span>
                          <Badge variant={severityColor(incident.severity)} className="text-xs">
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{incident.location}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge variant={statusColor(incident.status)} className="text-xs">
                          {incident.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(incident.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShieldCheck className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No incidents reported</p>
                  <p className="text-xs text-muted-foreground mt-1">Everything looks safe</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                Active Alerts
              </CardTitle>
              <Badge variant={activeAlerts.length > 0 ? "destructive" : "secondary"} className="text-xs">
                {activeAlerts.length} active
              </Badge>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : activeAlerts.length > 0 ? (
                <div className="space-y-3">
                  {activeAlerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-md bg-muted/50"
                      data-testid={`card-alert-${alert.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm truncate">{alert.title}</span>
                          <Badge variant={severityColor(alert.severity)} className="text-xs">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(alert.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                  <p className="text-xs text-muted-foreground mt-1">All clear</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                Recent Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              {checkinsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentCheckins.length > 0 ? (
                <div className="space-y-2">
                  {recentCheckins.map((checkin) => (
                    <div
                      key={checkin.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/50"
                      data-testid={`card-checkin-${checkin.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          checkin.status === "safe" ? "bg-status-online" :
                          checkin.status === "need_help" ? "bg-status-away" :
                          "bg-status-busy"
                        }`} />
                        <div>
                          <span className="text-sm font-medium">{checkin.name}</span>
                          {checkin.location && (
                            <p className="text-xs text-muted-foreground">{checkin.location}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTime(checkin.createdAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShieldCheck className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No check-ins yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                Critical Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : criticalIncidents.length > 0 ? (
                <div className="space-y-2">
                  {criticalIncidents.slice(0, 5).map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/50"
                      data-testid={`card-critical-${incident.id}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          incident.severity === "critical" ? "bg-status-busy" : "bg-status-away"
                        }`} />
                        <div className="min-w-0">
                          <span className="text-sm font-medium truncate block">{incident.title}</span>
                          <span className="text-xs text-muted-foreground">{incident.reportedBy}</span>
                        </div>
                      </div>
                      <Badge variant={statusColor(incident.status)} className="text-xs shrink-0">
                        {incident.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Activity className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No critical issues</p>
                  <p className="text-xs text-muted-foreground mt-1">All systems normal</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
