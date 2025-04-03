
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/utils/languageUtils';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';

const DashboardNavbar = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(t("logout"), {
        description: t("logoutSuccess")
      });
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("logoutFailed"), {
        description: t("logoutErrorMessage")
      });
    }
  };
  
  return <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md shadow-sm border-b border-white/5">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/dashboard-home" className="flex items-center">
          <img src="/lovable-uploads/6d729402-326b-4ed3-a98b-f5f9eb232592.png" alt="Pinterest Grab" className="h-8" />
          <span className="ml-2 font-semibold text-lg">Pinterest Grab</span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* User Menu */}
          {user && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 border border-white/10 rounded-lg hover:bg-black hover:text-pinterest-red transition-all duration-200 relative group overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#ff3366]/30 to-[#ff0066]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                  <User className="h-4 w-4 relative z-10" />
                  <span className="hidden md:inline relative z-10">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border border-white/10 bg-black shadow-xl">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer hover:text-pinterest-red transition-colors">{t('profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer hover:text-pinterest-red transition-colors">{t('settings')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-pinterest-red hover:text-pinterest-red hover:bg-pinterest-red/10 flex items-center gap-2 transition-all duration-200 relative group overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#ff3366]/20 to-[#ff0066]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <LogOut className="h-4 w-4 relative z-10" /> 
                  <span className="relative z-10">{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>}
        </div>
      </div>
    </header>;
};

export default DashboardNavbar;
