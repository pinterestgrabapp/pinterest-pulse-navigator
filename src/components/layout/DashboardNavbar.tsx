
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/utils/languageUtils';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const DashboardNavbar = () => {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-sm border-b border-white/10 dark:border-white/5">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="/lovable-uploads/6d729402-326b-4ed3-a98b-f5f9eb232592.png" 
            alt="Pinterest Grab" 
            className="h-8" 
          />
          <span className="ml-2 font-semibold text-lg">Pinterest Grab</span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 border border-white/10 dark:border-white/5 rounded-lg transition-all duration-200" 
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? 
              <Sun size={20} className="text-yellow-400 animate-pulse" /> : 
              <Moon size={20} className="text-gray-600" />
            }
          </Button>
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 border border-white/10 dark:border-white/5 rounded-lg hover:bg-black hover:text-pinterest-red transition-all duration-200">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 hover:text-red-700 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
