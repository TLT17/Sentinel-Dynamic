interface PillarsWordmarkProps {
  variant?: "full" | "badge";
  className?: string;
  showSubBrands?: boolean;
}

export function PillarsWordmark({ variant = "full", className = "", showSubBrands = false }: PillarsWordmarkProps) {
  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span
          className="font-serif text-sm font-bold text-muted-foreground/50 tracking-[0.15em] leading-none"
          style={{ letterSpacing: "0.2em" }}
          aria-label="Three Pillars"
        >
          III
        </span>
        <span className="text-[9px] font-semibold tracking-[0.22em] text-muted-foreground/45 uppercase">
          Pillars
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className="w-24 h-24 flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
      >
        <img
          src="/iii-pilars-logo.png"
          alt="III Pillars"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center space-y-0.5">
        <p className="text-xs font-bold tracking-[0.35em] text-muted-foreground uppercase">
          III Pillars
        </p>
        {showSubBrands && (
          <p className="text-[10px] tracking-[0.18em] text-muted-foreground/45 uppercase">
            Eagles Haven &nbsp;·&nbsp; Sentinel Dynamic
          </p>
        )}
      </div>
    </div>
  );
}
