
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
        <Link to="/" className="flex items-center gap-2 px-3 py-2">
          <div className="relative w-8 h-8 overflow-hidden rounded-lg bg-pinterest-red flex items-center justify-center text-white font-bold">
            PG
          </div>
          <span className="font-semibold text-lg">Pinterest Grab</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                    tooltip={t(item.label)}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.label)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t('tools')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('keywordExplorer')}>
                  <Link to="/keyword-research">
                    <Hash className="h-4 w-4" />
                    <span>{t('keywordExplorer')}</span>
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
