import sigilPath from "@assets/image_1772723503197.png";

export default function SentinelFooter() {
  return (
    <footer className="border-t border-border mt-auto px-4 py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <img
            src={sigilPath}
            alt="Sentinel Sigil"
            className="w-4 h-4 object-contain"
            style={{
              filter: "invert(1) sepia(1) saturate(3) hue-rotate(140deg) brightness(0.9) contrast(1.4)",
              mixBlendMode: "screen",
            }}
          />
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
