import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import LanguageSelectPage from "@/pages/language-select";
import LandingPage from "@/pages/landing";
import HomePage from "@/pages/home";
import ContactsPage from "@/pages/contacts";
import AlertConfigPage from "@/pages/alert-config";
import CheckInPage from "@/pages/checkin";
import SafeLocationsPage from "@/pages/safe-locations";
import LiveMapPage from "@/pages/live-map";
import SettingsPage from "@/pages/settings";
import PrivacyPolicyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function InnerRouter() {
  return (
    <Switch>
      <Route path="/home" component={HomePage} />
      <Route path="/map" component={LiveMapPage} />
      <Route path="/contacts" component={ContactsPage} />
      <Route path="/alerts" component={AlertConfigPage} />
      <Route path="/checkin" component={CheckInPage} />
      <Route path="/locations" component={SafeLocationsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-1 p-2 border-b border-border bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <Button
              size="sm"
              variant="destructive"
              className="font-cinzel text-xs tracking-wider rounded-none flex items-center gap-1.5"
              onClick={() => window.location.replace("https://www.google.com")}
              data-testid="button-exit"
            >
              <X className="w-3 h-3" />
              <span className="hidden sm:inline">EXIT</span>
            </Button>
          </header>
          <main className="flex-1 overflow-hidden">
            <InnerRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function RootRouter() {
  const [location] = useLocation();

  if (location === "/") {
    return <LanguageSelectPage />;
  }

  if (location === "/welcome") {
    return <LandingPage />;
  }

  if (location === "/privacy") {
    return <PrivacyPolicyPage />;
  }

  if (location === "/terms") {
    return <TermsPage />;
  }

  return <AppLayout />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <RootRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
