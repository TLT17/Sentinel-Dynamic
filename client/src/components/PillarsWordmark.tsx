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
        style={{
          width: 80,
          height: 80,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src="/iii-pilars-logo.png"
          alt="III Pillars"
          style={{
            width: "142%",
            height: "142%",
            objectFit: "cover",
            objectPosition: "center",
            marginLeft: "-21%",
            marginTop: "-21%",
          }}
        />
      </div>
      <div className="text-center" style={{ marginTop: 4 }}>
        <p
          style={{
            fontFamily: "serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          III PILLARS
        </p>
        {showSubBrands && (
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
              marginTop: 3,
            }}
          >
            Sentinel Dynamic &nbsp;·&nbsp; Eagles Haven
          </p>
        )}
      </div>
    </div>
  );
}
