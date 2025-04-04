
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Search, TrendingUp, ImagePlus, Settings, 
  BarChart4, Bookmark, User, FileDown, HelpCircle, 
  BarChart2, DollarSign, 
  Users, ShoppingCart, Calendar, LineChart
} from 'lucide-react';
import { useLanguage } from '@/utils/languageUtils';
import { useTheme } from '@/hooks/use-theme';

export const DashboardSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const navigationItems = [
    { icon: LayoutDashboard, label: 'dashboard', href: '/dashboard-home' },
    { icon: TrendingUp, label: 'pinAnalysis', href: '/dashboard' },
    { icon: Search, label: 'keywordResearch', href: '/keyword-research' },
    { icon: LineChart, label: 'pinterestAnalytics', href: '/pinterest-analytics' },
    { icon: BarChart4, label: 'pinStats', href: '/pin-stats' },
    { icon: Bookmark, label: 'savedPins', href: '/saved-pins' },
    { icon: FileDown, label: 'export', href: '/export' },
    { icon: ImagePlus, label: 'createPin', href: '/create-pin' },
    // New navigation items for additional features
    { icon: BarChart2, label: 'analytics', href: '/analytics' },
    { icon: DollarSign, label: 'adCampaigns', href: '/ad-campaigns' },
    { icon: Calendar, label: 'contentCalendar', href: '/content-calendar' },
    { icon: Users, label: 'teamCollaboration', href: '/team-collaboration' },
    { icon: ShoppingCart, label: 'ecommerce', href: '/ecommerce' },
  ];

  const accountItems = [
    { icon: Settings, label: 'settings', href: '/settings' },
    { icon: User, label: 'profile', href: '/profile' },
    { icon: HelpCircle, label: 'help', href: '/help' }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black py-4">
      <div className="flex-1 overflow-auto px-3">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
            {t('navigation')}
          </h3>
          <ul className="space-y-1">
            {navigationItems.map(item => (
              <li key={item.href}>
                <Link 
                  to={item.href} 
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative overflow-hidden ${
                    location.pathname === item.href || 
                    (item.href === '/dashboard' && location.pathname === '/pin-analysis') ||
                    (item.href === '/dashboard-home' && location.pathname === '/dashboard')
                      ? 'font-medium text-pinterest-red border border-white/20 shadow-[0_0_15px_rgba(234,56,76,0.3)]' 
                      : 'hover:text-pinterest-red dark:hover:text-pinterest-red hover:shadow-[0_0_10px_rgba(234,56,76,0.3)] hover:border hover:border-white/20 dark:hover:border-white/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {(location.pathname === item.href || 
                    (item.href === '/dashboard' && location.pathname === '/pin-analysis') ||
                    (item.href === '/dashboard-home' && location.pathname === '/dashboard')) && (
                    <span className="absolute inset-0 bg-black dark:bg-black"></span>
                  )}
                  {(location.pathname === item.href || 
                    (item.href === '/dashboard' && location.pathname === '/pin-analysis') ||
                    (item.href === '/dashboard-home' && location.pathname === '/dashboard')) && (
                    <span className="absolute inset-0 bg-gradient-to-r from-[#ff3366]/20 to-[#ff0066]/20 blur-sm"></span>
                  )}
                  <item.icon className={`h-4 w-4 relative z-10 ${
                    location.pathname === item.href || 
                    (item.href === '/dashboard' && location.pathname === '/pin-analysis') ||
                    (item.href === '/dashboard-home' && location.pathname === '/dashboard')
                      ? 'text-pinterest-red' : ''}`} />
                  <span className="relative z-10">{item.label === 'pinterestAnalytics' ? 'Pinterest Analytics' : t(item.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
            {t('account')}
          </h3>
          <ul className="space-y-1">
            {accountItems.map(item => (
              <li key={item.href}>
                <Link 
                  to={item.href} 
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative overflow-hidden ${
                    location.pathname === item.href 
                      ? 'font-medium text-pinterest-red border border-white/20 shadow-[0_0_15px_rgba(234,56,76,0.3)]' 
                      : 'hover:text-pinterest-red dark:hover:text-pinterest-red hover:shadow-[0_0_10px_rgba(234,56,76,0.3)] hover:border hover:border-white/20 dark:hover:border-white/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {location.pathname === item.href && (
                    <span className="absolute inset-0 bg-black dark:bg-black"></span>
                  )}
                  {location.pathname === item.href && (
                    <span className="absolute inset-0 bg-gradient-to-r from-[#ff3366]/20 to-[#ff0066]/20 blur-sm"></span>
                  )}
                  <item.icon className={`h-4 w-4 relative z-10 ${location.pathname === item.href ? 'text-pinterest-red' : ''}`} />
                  <span className="relative z-10">{t(item.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
