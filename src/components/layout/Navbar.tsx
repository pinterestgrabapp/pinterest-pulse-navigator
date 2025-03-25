
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogIn, UserPlus, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/utils/languageUtils';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  isMinimal?: boolean;
}

export const Navbar = ({
  isMinimal = false
}: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-sm border-b border-white/10 dark:border-white/5">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/6d729402-326b-4ed3-a98b-f5f9eb232592.png" 
            alt="Pinterest Grab" 
            className="h-8" 
          />
          <span className="ml-2 font-semibold text-lg">Pinterest Grab</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-pinterest-red transition-colors">
            How It Works
          </Link>
          <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-pinterest-red transition-colors">
            Pricing
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 dark:text-gray-300 p-2" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 border border-white/10 dark:border-white/5" 
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? 
              <Sun size={20} className="text-yellow-400" /> : 
              <Moon size={20} className="text-gray-600" />
            }
          </Button>
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 border border-white/10 dark:border-white/5">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 border border-white/10 dark:border-white/5"
                onClick={() => navigate('/auth')}
              >
                <LogIn className="h-4 w-4" />
                <span>{t('login')}</span>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-pinterest-red border border-white/10"
                onClick={() => {
                  navigate('/auth');
                  setTimeout(() => document.getElementById('register-tab')?.click(), 100);
                }}
              >
                <UserPlus className="h-4 w-4" />
                <span>{t('signup')}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-black shadow-md p-4 flex flex-col gap-4 border-t border-white/10 dark:border-white/5">
            <Link 
              to="/#how-it-works" 
              className="text-gray-600 dark:text-gray-300 hover:text-pinterest-red transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-600 dark:text-gray-300 hover:text-pinterest-red transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="text-gray-600 dark:text-gray-300 border border-white/10 dark:border-white/5"
              >
                {theme === 'dark' ? 
                  <Sun size={20} className="text-yellow-400" /> : 
                  <Moon size={20} className="text-gray-600" />
                }
              </Button>
              
              <LanguageSwitcher />
            </div>
            
            {user ? (
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start border border-white/10 dark:border-white/5"
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start border border-white/10 dark:border-white/5"
                  onClick={() => {
                    navigate('/settings');
                    setMobileMenuOpen(false);
                  }}
                >
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start border border-white/10 dark:border-white/5"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start gap-2 border border-white/10 dark:border-white/5"
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  {t('login')}
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="justify-start gap-2 bg-pinterest-red border border-white/10"
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                    setTimeout(() => document.getElementById('register-tab')?.click(), 100);
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  {t('signup')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
