import { AlertTriangle, Users, Shield } from "lucide-react";

const levelConfig: Record<number, { icon: typeof AlertTriangle; label: string; subtitle: string; color: string; description: string }> = {
  1: { icon: AlertTriangle, label: "LEVEL 1", subtitle: "EMERGENCY", color: "#ff4444", description: "Contacts emergency services + all contacts" },
  2: { icon: Users, label: "LEVEL 2", subtitle: "TRUSTED", color: "#4f7ef8", description: "Alerts trusted contacts only" },
  3: { icon: Shield, label: "LEVEL 3", subtitle: "GENERAL", color: "#00d4aa", description: "Alerts general contacts" },
};

interface LevelIndicatorProps {
  level: number;
  isActive?: boolean;
  onClick?: () => void;
  contactCount: number;
}

export default function LevelIndicator({ level, isActive, onClick, contactCount }: LevelIndicatorProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={
        "w-full p-4 border-2 transition-all duration-300 text-left " +
        (isActive
          ? "border-current"
          : "border-border bg-card hover-elevate")
      }
      style={{
        borderColor: isActive ? config.color : undefined,
        backgroundColor: isActive ? config.color + "10" : undefined,
      }}
      data-testid={`button-level-${level}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 border-2 flex items-center justify-center"
            style={{ borderColor: config.color }}
          >
            <Icon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div>
            <div className="font-cinzel text-foreground tracking-wider">{config.label}</div>
            <div className="text-xs tracking-widest" style={{ color: config.color }}>{config.subtitle}</div>
          </div>
        </div>
        <span className="text-sm text-muted-foreground font-cinzel">{contactCount} CONTACTS</span>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{config.description}</p>
    </button>
  );
}
