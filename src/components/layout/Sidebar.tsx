
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp,
  ImagePlus,
  Settings,
  Hash
} from 'lucide-react';
import { useLanguage } from '@/utils/languageUtils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

export const DashboardSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: 'dashboard',
      href: '/dashboard'
    },
    {
      icon: Search,
      label: 'keywordResearch',
      href: '/keyword-research'
    },
    {
      icon: TrendingUp,
      label: 'pinAnalysis',
      href: '/pin-analysis'
    },
    {
      icon: ImagePlus,
      label: 'createPin',
      href: '/create-pin'
    },
    {
      icon: Settings,
      label: 'settings',
      href: '/settings'
    }
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="pb-0">
        <Link to="/" className="flex items-center justify-center px-3 py-2">
          <img 
            src="/lovable-uploads/6d729402-326b-4ed3-a98b-f5f9eb232592.png" 
            alt="Pinterest Grab" 
            className="h-14"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation' as any)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                    tooltip={t(item.label as any)}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.label as any)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t('tools' as any)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('keywordExplorer' as any)}>
                  <Link to="/keyword-research">
                    <Hash className="h-4 w-4" />
                    <span>{t('keywordExplorer' as any)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-xs text-muted-foreground px-3 py-2">
          © 2023 Pinterest Grab
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
