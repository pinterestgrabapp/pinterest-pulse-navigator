import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Search, TrendingUp, ImagePlus, Settings, Hash, BarChart4, BookText, Bookmark, User } from 'lucide-react';
import { useLanguage } from '@/utils/languageUtils';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
export const DashboardSidebar = () => {
  const location = useLocation();
  const {
    t
  } = useLanguage();
  const navigationItems = [{
    icon: LayoutDashboard,
    label: 'dashboard',
    href: '/dashboard'
  }, {
    icon: Search,
    label: 'keywordResearch',
    href: '/keyword-research'
  }, {
    icon: TrendingUp,
    label: 'pinAnalysis',
    href: '/pin-analysis'
  }, {
    icon: ImagePlus,
    label: 'createPin',
    href: '/create-pin'
  }, {
    icon: BarChart4,
    label: 'pinStats',
    href: '/pin-stats'
  }, {
    icon: Bookmark,
    label: 'savedPins',
    href: '/saved-pins'
  }];
  return <Sidebar variant="inset" className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <SidebarHeader className="pb-0">
        <Link to="/" className="flex items-center justify-center px-3 py-2">
          
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">{t('navigation' as any)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.href} tooltip={t(item.label as any)} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Link to={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.label as any)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">{t('tools' as any)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('keywordExplorer' as any)} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Link to="/keyword-research" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                    <Hash className="h-4 w-4" />
                    <span>{t('keywordExplorer' as any)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">{t('account' as any)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('settings' as any)} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>{t('settings' as any)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('profile' as any)} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                    <User className="h-4 w-4" />
                    <span>{t('profile' as any)}</span>
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
    </Sidebar>;
};
export default DashboardSidebar;