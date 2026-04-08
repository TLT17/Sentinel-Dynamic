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
  Home,
  Users,
  Bell,
  Clock,
  MapPin,
  Map,
  Settings,
  Info,
  Shield,
  FileText,
} from "lucide-react";
import sigilPath from "@assets/image_1772723503197.png";

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
        <Link href="/home">
          <div className="flex items-center gap-3 cursor-pointer" data-testid="link-home-logo">
            <img
              src={sigilPath}
              alt="Sentinel Sigil"
              className="w-9 h-9 object-contain"
              style={{ filter: "invert(1) sepia(1) saturate(3) hue-rotate(140deg) brightness(0.9)", mixBlendMode: "screen" }}
            />
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
        <div className="flex items-center gap-3 mb-3">
          <Link href="/about">
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-sidebar-about">
              <Info className="w-3.5 h-3.5" />
              <span className="font-cinzel text-[10px] tracking-wider">ABOUT</span>
            </div>
          </Link>
          <Link href="/privacy">
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-sidebar-privacy">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-cinzel text-[10px] tracking-wider">PRIVACY</span>
            </div>
          </Link>
          <Link href="/terms">
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-sidebar-terms">
              <FileText className="w-3.5 h-3.5" />
              <span className="font-cinzel text-[10px] tracking-wider">TERMS</span>
            </div>
          </Link>
        </div>
        <p className="text-[10px] text-muted-foreground font-cinzel tracking-wider">SENTINEL DYNAMIC v1.0</p>
        <p className="text-[9px] text-muted-foreground/60 mt-0.5">PROTECTING WHAT MATTERS</p>
      </SidebarFooter>
    </Sidebar>
  );
}
