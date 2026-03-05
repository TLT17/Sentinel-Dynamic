import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b-2 border-border p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/welcome">
            <Button variant="ghost" className="rounded-none font-cinzel text-xs tracking-wider" data-testid="button-back-privacy">
              <ChevronLeft className="w-4 h-4 mr-1" />BACK
            </Button>
          </Link>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="max-w-3xl mx-auto p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-cinzel text-2xl text-foreground tracking-[0.2em]" data-testid="text-privacy-title">PRIVACY POLICY</h1>
          </div>
          <p className="text-muted-foreground text-xs mb-8 font-cinzel tracking-wider">LAST UPDATED: MARCH 2026</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">YOUR PRIVACY MATTERS</h2>
              <p>Sentinel Dynamic is built with your safety and privacy as the highest priority. This policy explains what information we collect, how we use it, and your rights regarding your data.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">INFORMATION WE COLLECT</h2>
              <div className="space-y-3">
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-cinzel text-sm text-foreground mb-1">CONTACT INFORMATION</p>
                  <p className="text-sm">Names and phone numbers of your emergency contacts, stored locally on our servers. This information is only used to send alerts when you trigger them.</p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-cinzel text-sm text-foreground mb-1">LOCATION DATA</p>
                  <p className="text-sm">GPS coordinates are collected only when you enable location tracking or trigger an alert. Your location is never tracked in the background without your knowledge.</p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-cinzel text-sm text-foreground mb-1">PREFERENCES</p>
                  <p className="text-sm">Your language choice, voice sensitivity settings, and safe locations are stored to personalise your experience.</p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-cinzel text-sm text-foreground mb-1">VOICE DATA</p>
                  <p className="text-sm">Voice activation is processed entirely on your device. No audio recordings are stored, transmitted, or saved to any server.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">HOW WE USE YOUR INFORMATION</h2>
              <ul className="space-y-2 text-sm list-none">
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> To send emergency alerts to your designated contacts when triggered</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> To share your GPS location with contacts during an active alert</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> To auto-disarm the system when you arrive at a safe location</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> To remember your preferences and settings between sessions</li>
              </ul>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">WHAT WE DO NOT DO</h2>
              <ul className="space-y-2 text-sm list-none">
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> We do not sell, share, or trade your personal information with third parties</li>
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> We do not track your location when the app is not actively in use</li>
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> We do not record, store, or transmit any audio from your device</li>
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> We do not use your data for advertising or marketing purposes</li>
                <li className="flex items-start gap-2"><span className="text-destructive mt-1.5 shrink-0">&#9642;</span> We do not use cookies or third-party tracking services</li>
              </ul>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">DATA STORAGE AND SECURITY</h2>
              <p className="text-sm mb-4">All data is stored on secure, self-hosted servers. Your information is encrypted in transit and at rest. We implement industry-standard security measures to protect your data from unauthorised access, alteration, or disclosure.</p>
              <div className="border-2 border-primary/30 bg-primary/5 p-4">
                <p className="font-cinzel text-sm text-primary tracking-wide mb-2">IN OTHER WORDS</p>
                <p className="text-sm text-foreground">All information you put into this app is only saved on your device, for your eyes only. Nothing is sent to the cloud where other people could access it. Your data stays with you and nobody else.</p>
              </div>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">YOUR RIGHTS</h2>
              <p className="text-sm mb-3">You have the right to:</p>
              <ul className="space-y-2 text-sm list-none">
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> Access all personal data we hold about you</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> Correct any inaccurate information</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> Request deletion of all your data at any time</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> Withdraw consent for location tracking at any time</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#9642;</span> Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">LEGAL COMPLIANCE</h2>
              <p className="text-sm">Sentinel Dynamic operates in compliance with applicable privacy and data protection laws, including but not limited to the New Zealand Privacy Act 2020, the Australian Privacy Act 1988, the General Data Protection Regulation (GDPR), and the Harmful Digital Communications Act 2015.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">CHILDREN'S PRIVACY</h2>
              <p className="text-sm">Sentinel Dynamic is designed for use by individuals of all ages who may need personal safety protection. For users under the age of 16, we recommend that a parent or guardian configure the application and its contacts.</p>
            </section>

            <section>
              <h2 className="font-cinzel text-lg text-foreground tracking-wider mb-3">CHANGES TO THIS POLICY</h2>
              <p className="text-sm">We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date. We encourage you to review this policy periodically.</p>
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
