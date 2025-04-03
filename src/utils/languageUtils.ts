
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { TRANSLATIONS, DEFAULT_LANGUAGE } from '@/lib/constants';

// Define types
export type Language = keyof typeof TRANSLATIONS;
export type TranslationKey = keyof (typeof TRANSLATIONS)[typeof DEFAULT_LANGUAGE];

// Create interface for the context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context for language
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || detectBrowserLanguage();
  });

  useEffect(() => {
    // Save language preference to localStorage when it changes
    localStorage.setItem('language', language);
    // Add HTML lang attribute for better accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Function to get translations based on the current language
  const t = useCallback((key: string): string => {
    if (!TRANSLATIONS[language]) {
      console.warn(`Language "${language}" is not available, using default language "${DEFAULT_LANGUAGE}"`);
      return TRANSLATIONS[DEFAULT_LANGUAGE][key as TranslationKey] || key;
    }
    
    return (TRANSLATIONS[language] as Record<string, string>)[key] || 
           TRANSLATIONS[DEFAULT_LANGUAGE][key as TranslationKey] || 
           key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper to detect browser language
export const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined' || !navigator) {
    return DEFAULT_LANGUAGE;
  }
  
  const browserLanguage = navigator.language.split('-')[0] as Language;
  return TRANSLATIONS[browserLanguage] ? browserLanguage : DEFAULT_LANGUAGE;
};
