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
          style={{ fontFamily: "serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)" }}
          aria-label="Three Pillars"
        >
          III
        </span>
        <span style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
          Pillars
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ gap: 12 }}>
      <div
        style={{
          width: 110,
          height: 110,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src="/iii-pilars-logo.png"
          alt="III Pillars"
          style={{
            width: "155%",
            height: "155%",
            objectFit: "cover",
            objectPosition: "center center",
            marginLeft: "-27.5%",
            marginTop: "-27.5%",
          }}
        />
      </div>
      <div className="text-center" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ fontFamily: "Cinzel, serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.3em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", margin: 0 }}>
          III PILLARS
        </p>
        {showSubBrands && (
          <p style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", margin: 0 }}>
            Sentinel Dynamic &nbsp;·&nbsp; Eagles Haven
          </p>
        )}
      </div>
    </div>
  );
}
