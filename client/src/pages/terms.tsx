import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b-2 border-border p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/welcome">
            <Button variant="ghost" className="rounded-none font-cinzel text-xs tracking-wider" data-testid="button-back-terms">
              <ChevronLeft className="w-4 h-4 mr-1" />BACK
            </Button>
          </Link>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="max-w-3xl mx-auto p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-cinzel text-2xl text-foreground tracking-[0.2em]" data-testid="text-terms-title">TERMS OF USE</h1>
          </div>
          <p className="text-muted-foreground text-xs mb-8 font-cinzel tracking-wider">LAST UPDATED: MARCH 2026</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">ACCEPTANCE OF TERMS</h2>
              <p className="text-sm">By accessing or using Sentinel Dynamic, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should not use the application.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">DESCRIPTION OF SERVICE</h2>
              <p className="text-sm">Sentinel Dynamic is a voice-activated personal safety application that enables users to send emergency alerts to designated contacts. The application includes features such as voice-triggered alerts, GPS location sharing, check-in timers, and safe location management.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">IMPORTANT SAFETY NOTICE</h2>
              <div className="border-2 border-yellow-600/50 bg-yellow-600/10 p-4">
                <p className="text-sm text-yellow-500 mb-3 font-cinzel tracking-wide">PLEASE READ CAREFULLY</p>
                <ul className="space-y-2 text-sm list-none">
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1.5 shrink-0">&#9642;</span> Sentinel Dynamic is a supplementary safety tool and should not be relied upon as your sole means of emergency communication</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1.5 shrink-0">&#9642;</span> Always call your local emergency number (e.g., 111, 911, 999, 112) when in immediate danger if it is safe to do so</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1.5 shrink-0">&#9642;</span> The application requires an active internet connection to send alerts to contacts. The decoy beep feature works offline</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1.5 shrink-0">&#9642;</span> GPS accuracy depends on your device and environmental conditions</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1.5 shrink-0">&#9642;</span> Voice recognition accuracy may vary based on background noise, distance, and device capabilities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">USER RESPONSIBILITIES</h2>
              <ul className="space-y-2 text-sm list-none">
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> You are responsible for keeping your emergency contacts up to date</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> You should inform your emergency contacts that they are listed in your safety network</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> You are responsible for testing the application regularly to ensure it functions correctly</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> You should not use the application to send false emergency alerts</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> You must comply with all applicable local laws regarding emergency communications</li>
              </ul>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">ACCEPTABLE USE</h2>
              <p className="text-sm mb-3">Sentinel Dynamic is intended for personal safety purposes only. You agree not to:</p>
              <ul className="space-y-2 text-sm list-none">
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> Use the application for any unlawful purpose</li>
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> Attempt to gain unauthorised access to the system or other users' data</li>
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> Use the application to harass, stalk, or intimidate others</li>
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> Reverse engineer, decompile, or disassemble the application</li>
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> Misuse the decoy mode feature to deceive emergency services</li>
              </ul>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">INTELLECTUAL PROPERTY</h2>
              <p className="text-sm">All content, design, graphics, the Sentinel Dynamic sigil, and the compilation of all content on this application are the exclusive property of Sentinel Dynamic and are protected by copyright and intellectual property laws. The sigil is a protected trademark of Sentinel Dynamic.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">LIMITATION OF LIABILITY</h2>
              <p className="text-sm">To the fullest extent permitted by law, Sentinel Dynamic and its creators shall not be held liable for any direct, indirect, incidental, consequential, or special damages arising from the use or inability to use this application, including but not limited to situations where alerts fail to send, location data is inaccurate, or voice recognition does not activate as expected.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">INDEMNIFICATION</h2>
              <p className="text-sm">You agree to indemnify and hold harmless Sentinel Dynamic, its creators, and affiliates from any claims, damages, losses, or expenses arising from your use of the application or violation of these terms.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">MODIFICATIONS TO TERMS</h2>
              <p className="text-sm">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the application. Your continued use of Sentinel Dynamic after changes constitutes acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">GOVERNING LAW</h2>
              <p className="text-sm">These terms shall be governed by and construed in accordance with the laws of New Zealand. Any disputes arising from these terms or the use of the application shall be subject to the exclusive jurisdiction of the courts of New Zealand.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">SEVERABILITY</h2>
              <p className="text-sm">If any provision of these terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these terms shall otherwise remain in full force and effect.</p>
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
