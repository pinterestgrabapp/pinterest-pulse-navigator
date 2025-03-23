
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME, NAV_ITEMS } from '@/lib/constants';
import { useLanguage } from '@/utils/languageUtils';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 shadow-md' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <div className="relative w-9 h-9 overflow-hidden rounded-xl bg-pinterest-red flex items-center justify-center text-white font-bold">
            PG
          </div>
          <span className="text-xl font-semibold">{APP_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAV_ITEMS.map(item => (
            <Link 
              key={item.href}
              to={item.href}
              className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                location.pathname === item.href
                  ? 'text-primary font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          
          <div className="hidden md:flex space-x-2">
            <Button variant="ghost" size="sm">
              {t('login')}
            </Button>
            <Button variant="default" size="sm">
              {t('signup')}
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg animate-fade-in">
          <nav className="container px-4 mx-auto py-4 flex flex-col">
            {NAV_ITEMS.map(item => (
              <Link 
                key={item.href}
                to={item.href}
                className={`px-4 py-3 rounded-md transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'bg-accent text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t(item.label)}
              </Link>
            ))}
            <div className="mt-4 flex flex-col space-y-2 px-4">
              <Button variant="outline" className="justify-start">
                {t('login')}
              </Button>
              <Button variant="default" className="justify-start">
                {t('signup')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
