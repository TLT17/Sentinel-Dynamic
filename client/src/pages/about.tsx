import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Heart, Shield, Globe, Mic, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import sigilPath from "@assets/image_1772723503197.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b-2 border-border p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/welcome">
            <Button variant="ghost" className="rounded-none font-cinzel text-xs tracking-wider" data-testid="button-back-about">
              <ChevronLeft className="w-4 h-4 mr-1" />BACK
            </Button>
          </Link>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="max-w-3xl mx-auto p-6 md:p-10">
          <div className="text-center mb-12">
            <div className="w-28 h-28 mx-auto mb-6">
              <img
                src={sigilPath}
                alt="Sentinel Dynamic Sigil"
                className="w-full h-full object-contain"
                style={{ filter: "invert(1) sepia(1) saturate(3) hue-rotate(140deg) brightness(0.9)", mixBlendMode: "screen" }}
              />
            </div>
            <h1 className="font-cinzel text-3xl text-foreground tracking-[0.2em] mb-2" data-testid="text-about-title">ABOUT</h1>
            <h2 className="font-cinzel text-xl text-primary tracking-[0.3em]">SENTINEL DYNAMIC</h2>
          </div>

          <div className="space-y-10 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-4 flex items-center gap-3">
                <Heart className="w-5 h-5 text-primary" />
                OUR PURPOSE
              </h2>
              <p className="text-sm mb-3">Sentinel Dynamic was created with one clear purpose: to protect people. Born from real-life experience, this app exists for anyone who has ever felt unsafe, unheard, or alone in a moment where they needed help the most.</p>
              <p className="text-sm">Whether you are walking home at night, in an unfamiliar place, or living in a situation where your safety is at risk — Sentinel Dynamic is designed to be the lifeline you carry in your pocket.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                THE SIGIL
              </h2>
              <p className="text-sm mb-3">The Sentinel Dynamic logo is more than a picture — it is a sigil. Created with intention and purpose, it was designed by the founder as a symbol of protection. The sun, mountains, and water within the sigil all carry ancient meanings of protection and strength.</p>
              <p className="text-sm">Every element was carefully crafted to represent the core intention behind this app: <span className="text-primary italic">"I use my strength and protection put upon me, to protect all those I can, no matter where in the world they may be."</span></p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-4 flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                WHO THIS IS FOR
              </h2>
              <p className="text-sm mb-3">Sentinel Dynamic is for everyone. It does not matter where you come from, what language you speak, or what situation you are in. This app is built for:</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <div className="border-2 border-border bg-card p-4">
                  <p className="font-cinzel text-sm text-foreground tracking-wide mb-1">THOSE IN DANGER</p>
                  <p className="text-xs text-muted-foreground">People living in domestic violence situations, unsafe environments, or facing personal threats</p>
                </div>
                <div className="border-2 border-border bg-card p-4">
                  <p className="font-cinzel text-sm text-foreground tracking-wide mb-1">THOSE WHO TRAVEL</p>
                  <p className="text-xs text-muted-foreground">People in unfamiliar areas, travelling alone, or working late hours</p>
                </div>
                <div className="border-2 border-border bg-card p-4">
                  <p className="font-cinzel text-sm text-foreground tracking-wide mb-1">THOSE WHO CARE</p>
                  <p className="text-xs text-muted-foreground">Parents, partners, and friends who want peace of mind knowing their loved ones have a safety net</p>
                </div>
                <div className="border-2 border-border bg-card p-4">
                  <p className="font-cinzel text-sm text-foreground tracking-wide mb-1">THOSE WHO SERVE</p>
                  <p className="text-xs text-muted-foreground">Social workers, healthcare workers, and anyone whose job puts them in vulnerable situations</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-4">KEY FEATURES</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-3 border border-border">
                  <Mic className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-cinzel text-sm text-foreground tracking-wide">VOICE ACTIVATION</p>
                    <p className="text-xs text-muted-foreground">Trigger alerts with a spoken phrase, even when your phone is in your pocket</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border border-border">
                  <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-cinzel text-sm text-foreground tracking-wide">3-TIER CONTACT SYSTEM</p>
                    <p className="text-xs text-muted-foreground">Emergency services, trusted contacts, and your wider support network — each level with its own trigger</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border border-border">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-cinzel text-sm text-foreground tracking-wide">LIVE GPS MAP</p>
                    <p className="text-xs text-muted-foreground">Real-time location tracking, nearby safe places, police stations, and hospitals at your fingertips</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border border-border">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-cinzel text-sm text-foreground tracking-wide">CHECK-IN TIMER</p>
                    <p className="text-xs text-muted-foreground">Set a timer and if you do not check in, your contacts are automatically alerted</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border border-border">
                  <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-cinzel text-sm text-foreground tracking-wide">DECOY MODE</p>
                    <p className="text-xs text-muted-foreground">Beep sounds still play when disarmed, making it appear active to anyone nearby — your choice to turn on or off</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 border-primary/30 bg-primary/5 p-6">
              <p className="text-center text-sm text-primary font-cinzel tracking-wider mb-3">OUR PROMISE</p>
              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                No data sold. No tracking behind your back. No ads. No subscriptions. Just a tool built by someone who understands what it means to need protection — for the people who need it most.
              </p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-4">VERSION</h2>
              <div className="bg-card border-2 border-border p-4">
                <div className="flex justify-between items-center">
                  <span className="font-cinzel text-sm text-foreground tracking-wide">SENTINEL DYNAMIC</span>
                  <span className="text-primary font-cinzel text-sm">v1.0</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Self-hosted. Open source. Free forever.</p>
              </div>
            </section>

            <section className="border-t-2 border-border pt-8">
              <p className="text-sm text-muted-foreground/60 font-cinzel tracking-wider text-center">&copy; 2026 SENTINEL DYNAMIC. ALL RIGHTS RESERVED.</p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
