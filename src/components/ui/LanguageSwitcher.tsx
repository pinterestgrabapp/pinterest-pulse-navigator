import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGES } from '@/lib/constants';
import { useLanguage, Language } from '@/utils/languageUtils';

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  const handleSelectLanguage = (code: string) => {
    setLanguage(code as Language);
    setOpen(false);
    
    // Add a page reload after language change to ensure all components re-render
    // with the new language (this is optional but ensures a clean state)
    // window.location.reload();
  };
  
  // Find current language information
  const currentLanguage = LANGUAGES.find(lang => lang.code === language) || LANGUAGES[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 px-2 hover:bg-accent hover:text-accent-foreground"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLanguage.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] overflow-y-auto max-h-[400px]">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
              lang.code === language ? 'bg-accent text-accent-foreground' : ''
            }`}
            onClick={() => handleSelectLanguage(lang.code)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </div>
            {lang.code === language && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
