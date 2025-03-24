import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Globe, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/utils/languageUtils';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTheme } from '@/hooks/use-theme';
interface NavbarProps {
  isMinimal?: boolean;
}
export const Navbar = ({
  isMinimal = false
}: NavbarProps) => {
  const location = useLocation();
  const {
    t
  } = useLanguage();
  const {
    theme,
    setTheme
  } = useTheme();
  return <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/6d729402-326b-4ed3-a98b-f5f9eb232592.png" alt="Pinterest Grab" className="h-10" />
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </Button>
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              <span>{t('login')}</span>
            </Button>
            <Button variant="default" size="sm" className="gap-2 bg-pinterest-red">
              <UserPlus className="h-4 w-4" />
              <span>{t('signup')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>;
};
export default Navbar;