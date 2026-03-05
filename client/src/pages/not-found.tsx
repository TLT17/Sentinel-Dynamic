import { Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-20 h-20 border-2 border-primary flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-cinzel text-3xl text-foreground tracking-[0.2em] mb-2">404</h1>
        <p className="text-muted-foreground font-cinzel tracking-wider mb-6">SECTOR NOT FOUND</p>
        <Link href="/">
          <Button className="font-cinzel tracking-wider rounded-none" data-testid="button-go-home">
            RETURN TO BASE
          </Button>
        </Link>
      </div>
    </div>
  );
}
