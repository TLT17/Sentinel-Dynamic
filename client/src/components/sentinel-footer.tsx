import { Shield } from "lucide-react";

export default function SentinelFooter() {
  return (
    <footer className="border-t border-border mt-auto px-4 py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="font-cinzel text-xs text-foreground tracking-wider">SENTINEL DYNAMIC</span>
        </div>
        <div className="text-center md:text-right">
          <p className="text-muted-foreground text-[10px] font-cinzel tracking-wider">
            2026 SENTINEL DYNAMIC | PROTECTING WHAT MATTERS
          </p>
        </div>
      </div>
    </footer>
  );
}
