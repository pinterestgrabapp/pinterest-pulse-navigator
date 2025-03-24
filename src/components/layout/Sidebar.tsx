
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Search, TrendingUp, ImagePlus, Settings, Hash, BarChart4, BookText, Bookmark, User, FileDown, HelpCircle } from 'lucide-react';
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
    { icon: FileDown, label: 'Export', href: '/export' },
    { icon: ImagePlus, label: 'createPin', href: '/create-pin' },
    { icon: BarChart4, label: 'pinStats', href: '/pin-stats' },
    { icon: Bookmark, label: 'savedPins', href: '/saved-pins' }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 py-4">
      <div className="flex-1 overflow-auto px-3">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
            {t('navigation' as any)}
          </h3>
          <ul className="space-y-1">
            {navigationItems.map(item => (
              <li key={item.href}>
                <Link 
                  to={item.href} 
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    location.pathname === item.href 
                      ? 'bg-gray-100 dark:bg-gray-800 font-medium text-primary' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label === 'Export' ? 'Export' : t(item.label as any)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
            {t('tools' as any)}
          </h3>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/keyword-research" 
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === '/keyword-research' 
                    ? 'bg-gray-100 dark:bg-gray-800 font-medium text-primary' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Hash className="h-4 w-4" />
                <span>{t('keywordExplorer' as any)}</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
            {t('account' as any)}
          </h3>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === '/settings' 
                    ? 'bg-gray-100 dark:bg-gray-800 font-medium text-primary' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>{t('settings' as any)}</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === '/profile' 
                    ? 'bg-gray-100 dark:bg-gray-800 font-medium text-primary' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <User className="h-4 w-4" />
                <span>{t('profile' as any)}</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/help" 
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === '/help' 
                    ? 'bg-gray-100 dark:bg-gray-800 font-medium text-primary' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
