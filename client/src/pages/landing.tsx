import { Link } from "wouter";
import { motion } from "framer-motion";
import { Mic, Bell, Lock, Smartphone, Volume2, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/feature-card";
import sigilPath from "@assets/image_1772723503197.png";
import { PillarsWordmark } from "@/components/PillarsWordmark";

const features = [
  { icon: Mic, title: "VOICE ACTIVATION", description: "Custom trigger phrases activate alerts even when your phone is in your pocket or bag. Advanced voice recognition works through fabric and at a distance." },
  { icon: Bell, title: "3-TIER ALERT SYSTEM", description: "Level 1 contacts emergency services. Level 2 alerts trusted contacts. Level 3 notifies your general support network. Each with customized messages." },
  { icon: Lock, title: "DECOY MODE", description: "When disarmed, the system still produces confirmation beeps to maintain the appearance of activation, keeping you safe even when not actively monitoring." },
  { icon: Smartphone, title: "STEALTH OPERATION", description: "No visible indicators when armed. Works silently in the background. Your safety net remains invisible to potential threats." },
  { icon: MapPin, title: "GPS TRACKING", description: "Automatic location sharing with emergency contacts. Real-time coordinates included in all alert messages." },
  { icon: Volume2, title: "AUDIO CONFIRMATION", description: "Subtle beep confirms voice recognition. Audible only to you, signaling that help is on the way." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(hsl(164 100% 42%) 1px, transparent 1px), linear-gradient(90deg, hsl(164 100% 42%) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div className="w-36 h-36 mx-auto mb-8">
            <img
              src={sigilPath}
              alt="Sentinel Dynamic Sigil"
              className="w-full h-full object-contain"
              style={{ filter: "invert(1) sepia(1) saturate(3) hue-rotate(140deg) brightness(0.9)", mixBlendMode: "screen" }}
              data-testid="img-landing-sigil"
            />
          </div>
          <h1 className="font-cinzel text-5xl md:text-7xl text-foreground tracking-[0.2em] mb-4" data-testid="text-landing-title">
            SENTINEL
          </h1>
          <h2 className="font-cinzel text-2xl md:text-3xl text-primary tracking-[0.4em] mb-8">
            DYNAMIC
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed mb-12">
            Your voice is your lifeline. One word can reach the people who matter most, no matter where you are or what you're facing.
          </p>
          <Link href="/home">
            <Button className="px-12 py-6 font-cinzel tracking-widest text-lg rounded-none" data-testid="button-get-started">
              GET STARTED <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-cinzel text-3xl text-foreground tracking-wider mb-4">PROTECTION FEATURES</h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="p-6 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-cinzel text-2xl text-foreground tracking-wider mb-6">
            YOUR SAFETY. YOUR VOICE. YOUR CONTROL.
          </h3>
          <Link href="/home">
            <Button className="px-12 py-6 font-cinzel tracking-widest text-lg rounded-none" data-testid="button-enter-app">
              ENTER APPLICATION <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <PillarsWordmark variant="full" showSubBrands />
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-muted-foreground/40 text-[10px] font-cinzel tracking-wider">&copy; 2026 SENTINEL DYNAMIC</span>
            <span className="text-muted-foreground/20 text-[10px]">·</span>
            <Link href="/about">
              <span className="text-muted-foreground/40 text-[10px] font-cinzel tracking-wider hover:text-primary transition-colors cursor-pointer" data-testid="link-about">ABOUT</span>
            </Link>
            <span className="text-muted-foreground/20 text-[10px]">·</span>
            <Link href="/privacy">
              <span className="text-muted-foreground/40 text-[10px] font-cinzel tracking-wider hover:text-primary transition-colors cursor-pointer" data-testid="link-privacy">PRIVACY</span>
            </Link>
            <span className="text-muted-foreground/20 text-[10px]">·</span>
            <Link href="/terms">
              <span className="text-muted-foreground/40 text-[10px] font-cinzel tracking-wider hover:text-primary transition-colors cursor-pointer" data-testid="link-terms">TERMS</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
