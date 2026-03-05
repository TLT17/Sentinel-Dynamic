import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Shield,
  Home,
  Users,
  Bell,
  Clock,
  MapPin,
  Map,
  Settings,
} from "lucide-react";

const navItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Live Map", url: "/map", icon: Map },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Check-In", url: "/checkin", icon: Clock },
  { title: "Locations", url: "/locations", icon: MapPin },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer" data-testid="link-home-logo">
            <div className="flex items-center justify-center w-9 h-9 border-2 border-primary">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-sm font-bold tracking-[0.15em] text-foreground">SENTINEL</span>
              <span className="font-cinzel text-[10px] tracking-[0.2em] text-primary -mt-0.5">DYNAMIC</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-cinzel tracking-wider text-[10px]">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
                      <item.icon className="w-4 h-4" />
                      <span className="font-cinzel text-xs tracking-wider">{item.title.toUpperCase()}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground font-cinzel tracking-wider">SENTINEL DYNAMIC v1.0</p>
        <p className="text-[9px] text-muted-foreground/60 mt-0.5">PROTECTING WHAT MATTERS</p>
      </SidebarFooter>
    </Sidebar>
  );
}
