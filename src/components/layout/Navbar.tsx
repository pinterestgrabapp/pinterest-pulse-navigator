
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Menu, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/utils/languageUtils';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Function to handle smooth scrolling to section when on the home page
  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
      setMobileMenuOpen(false);
    } else {
      navigate(`/#${sectionId}`);
    }
  };
  
  return <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md shadow-sm border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/6d729402-326b-4ed3-a98b-f5f9eb232592.png" alt="Pinterest Grab" className="h-8" />
            <span className="ml-2 font-semibold text-lg glow-text text-white">Pinterest Grab</span>
          </Link>

          {/* Main Navigation - Center Aligned */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-6">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-300 hover:bg-black hover:text-pinterest-red hover:shadow-[0_0_12px_rgba(234,56,76,0.6)] hover:border hover:border-white/20 transition-all duration-300">
              <Home className="w-4 h-4" />
              <span>{t('home')}</span>
            </Link>
            
            <button onClick={() => scrollToSection('how-it-works')} className="px-4 py-2 rounded-md text-gray-300 hover:bg-black hover:text-pinterest-red hover:shadow-[0_0_12px_rgba(234,56,76,0.6)] hover:border hover:border-white/20 transition-all duration-300">
              Try It
            </button>
            
            <Link to="/pricing" className="px-4 py-2 rounded-md text-gray-300 hover:bg-black hover:text-pinterest-red hover:shadow-[0_0_12px_rgba(234,56,76,0.6)] hover:border hover:border-white/20 transition-all duration-300">
              {t('pricing')}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Auth Buttons */}
            {user ? <Button variant="default" size="sm" className="gap-2 bg-pinterest-red border border-white/10 animate-glow-pulse" onClick={() => navigate('/dashboard')}>
                {t('dashboard')}
              </Button> : <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2 border border-white/10 hover:shadow-[0_0_12px_rgba(234,56,76,0.6)]" onClick={() => navigate('/auth')}>
                  <LogIn className="h-4 w-4" />
                  <span>{t('login')}</span>
                </Button>
                <Button variant="default" size="sm" className="gap-2 bg-pinterest-red border border-white/10 animate-glow-pulse" onClick={() => {
              navigate('/auth');
              setTimeout(() => document.getElementById('register-tab')?.click(), 100);
            }}>
                  <UserPlus className="h-4 w-4" />
                  <span>{t('signup')}</span>
                </Button>
              </div>}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && <div className="md:hidden absolute top-16 left-0 right-0 bg-black shadow-md p-4 flex flex-col gap-4 border-t border-white/5">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-pinterest-red transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              <Home className="w-4 h-4" />
              <span>{t('home')}</span>
            </Link>
            
            <button onClick={() => scrollToSection('features')} className="text-left text-gray-300 hover:text-pinterest-red hover:glow-red transition-colors py-2">
              {t('features')}
            </button>
            
            <button onClick={() => scrollToSection('how-it-works')} className="text-left text-gray-300 hover:text-pinterest-red hover:glow-red transition-colors py-2">
              Try It
            </button>
            
            <Link to="/pricing" className="text-gray-300 hover:text-pinterest-red hover:glow-red transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('pricing')}
            </Link>
            
            <div className="border-t border-gray-800 my-2"></div>
            
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
            </div>
            
            {user ? <Button variant="default" size="sm" className="gap-2 bg-pinterest-red border border-white/10 animate-glow-pulse" onClick={() => {
          navigate('/dashboard');
          setMobileMenuOpen(false);
        }}>
                {t('dashboard')}
              </Button> : <div className="flex flex-col gap-2">
                <Button variant="ghost" size="sm" className="justify-start gap-2 border border-white/10 hover:shadow-[0_0_12px_rgba(234,56,76,0.6)]" onClick={() => {
            navigate('/auth');
            setMobileMenuOpen(false);
          }}>
                  <LogIn className="h-4 w-4" />
                  {t('login')}
                </Button>
                <Button variant="default" size="sm" className="justify-start gap-2 bg-pinterest-red border border-white/10 animate-glow-pulse" onClick={() => {
            navigate('/auth');
            setMobileMenuOpen(false);
            setTimeout(() => document.getElementById('register-tab')?.click(), 100);
          }}>
                  <UserPlus className="h-4 w-4" />
                  {t('signup')}
                </Button>
              </div>}
          </div>}
      </div>
    </header>;
};

export default Navbar;
