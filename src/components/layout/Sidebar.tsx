
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Search, TrendingUp, ImagePlus, Settings, BarChart4, Bookmark, User, FileDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/utils/languageUtils';
import { useTheme } from '@/hooks/use-theme';

export const DashboardSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const navigationItems = [
    { icon: LayoutDashboard, label: 'dashboard', href: '/dashboard' },
    { icon: Search, label: 'keywordResearch', href: '/keyword-research' },
    { icon: TrendingUp, label: 'pinAnalysis', href: '/pin-analysis' },
    { icon: BarChart4, label: 'pinStats', href: '/pin-stats' },
    { icon: Bookmark, label: 'savedPins', href: '/saved-pins' },
    { icon: FileDown, label: 'export', href: '/export' },
    { icon: ImagePlus, label: 'createPin', href: '/create-pin' },
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    location.pathname === item.href 
                      ? 'bg-black dark:bg-black font-medium text-pinterest-red border border-white/20' 
                      : 'hover:bg-black dark:hover:bg-black hover:text-pinterest-red dark:hover:text-pinterest-red hover:shadow-[0_0_8px_rgba(234,56,76,0.5)] hover:border hover:border-white/20 dark:hover:border-white/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{t(item.label)}</span>
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    location.pathname === item.href 
                      ? 'bg-black dark:bg-black font-medium text-pinterest-red border border-white/20' 
                      : 'hover:bg-black dark:hover:bg-black hover:text-pinterest-red dark:hover:text-pinterest-red hover:shadow-[0_0_8px_rgba(234,56,76,0.5)] hover:border hover:border-white/20 dark:hover:border-white/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{t(item.label)}</span>
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
