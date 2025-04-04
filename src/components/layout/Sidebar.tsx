
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/utils/languageUtils';
import { isPinterestConnected } from '@/utils/pinterestApiUtils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3,
  Calendar,
  LineChart, 
  SparkleIcon, 
  Search, 
  PinIcon, 
  ShoppingBag,
  UserPlus,
  PenBox,
  Image,
  MonitorSmartphone,
  Megaphone,
  ChartPieIcon,
  AlertCircle,
  Lightbulb,
  FlaskConical,
  Crown,
  PanelRight,
  DatabaseZap
} from 'lucide-react';

type SidebarProps = {
  className?: string;
  isMobile?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ className, isMobile = false, setMobileOpen }: SidebarProps) {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [hasConnectedPinterest, setHasConnectedPinterest] = useState(false);

  useEffect(() => {
    if (user?.id) {
      isPinterestConnected(user.id).then(connected => {
        setHasConnectedPinterest(connected);
      });
    }
  }, [user]);

  const handleClick = () => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const navItems = [
    {
      title: t('dashboard'),
      href: '/dashboard',
      icon: <LineChart className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('keywordResearch'),
      href: '/keyword-research',
      icon: <Search className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('pinAnalysis'),
      href: '/pin-analysis',
      icon: <BarChart3 className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: 'Advanced Analytics',
      href: '/advanced-analytics',
      icon: <DatabaseZap className="h-4 w-4" />,
      requiresAuth: true,
      new: true
    },
    {
      title: t('pinStats'),
      href: '/pin-stats',
      icon: <ChartPieIcon className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('contentCalendar'),
      href: '/content-calendar',
      icon: <Calendar className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('createPin'),
      href: '/create-pin',
      icon: <PenBox className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('savedPins'),
      href: '/saved-pins',
      icon: <PinIcon className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('export'),
      href: '/export',
      icon: <PanelRight className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('ecommerce'),
      href: '/ecommerce',
      icon: <ShoppingBag className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('teamCollaboration'),
      href: '/team',
      icon: <UserPlus className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('adCampaigns'),
      href: '/ad-campaigns',
      icon: <Megaphone className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('analytics'),
      href: '/analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      title: t('help'),
      href: '/help',
      icon: <AlertCircle className="h-4 w-4" />,
      requiresAuth: false,
    }
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2 mb-4 opacity-0" aria-hidden="true">
          {/* Empty placeholder for spacing */}
        </div>
        
        <div className="px-3">
          <h2 className="px-4 text-lg font-semibold tracking-tight">
            {t('sidebar.mainNavigation')}
          </h2>
          <div className="space-y-1 mt-2">
            {navItems.filter(item => !item.requiresAuth || (item.requiresAuth && !!user)).map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  location.pathname === item.href && "bg-accent"
                )}
                onClick={handleClick}
                asChild
              >
                <Link to={item.href} className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                  {item.new && (
                    <span className="ml-auto bg-green-600 text-white text-[10px] font-bold rounded px-1.5 py-0.5">
                      NEW
                    </span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        
        {!hasConnectedPinterest && user && (
          <div className="px-3 pt-2">
            <div className="rounded-md bg-pinterest-red bg-opacity-20 p-3">
              <div className="flex items-start">
                <SparkleIcon className="h-5 w-5 text-pinterest-red mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-pinterest-red">{t('connectPinterest')}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {t('connectPinterestDescription')}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 bg-pinterest-red hover:bg-pinterest-red/80 text-white border-none"
                    onClick={handleClick}
                    asChild
                  >
                    <Link to="/settings">
                      {t('connectNow')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!user && (
          <div className="px-3 pt-2">
            <div className="rounded-md bg-gray-800 p-3">
              <div className="flex">
                <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <h3 className="font-medium text-white">{t('getStarted')}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {t('getStartedDescription')}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                      onClick={handleClick}
                      asChild
                    >
                      <Link to="/auth">
                        {t('login')}
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-pinterest-red hover:bg-pinterest-red/80 text-white"
                      onClick={handleClick}
                      asChild
                    >
                      <Link to="/auth?signup=true">
                        {t('signUp')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
