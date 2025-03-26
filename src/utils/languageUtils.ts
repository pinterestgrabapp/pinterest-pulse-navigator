
import { useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS, DEFAULT_LANGUAGE } from '@/lib/constants';

// Define types
export type Language = keyof typeof TRANSLATIONS;
export type TranslationKey = keyof typeof TRANSLATIONS[typeof DEFAULT_LANGUAGE];

// Create context for language
export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    // Save language preference to localStorage when it changes
    localStorage.setItem('language', language);
    // Add HTML lang attribute for better accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Function to get translations based on the current language
  const t = useCallback((key: TranslationKey): string => {
    if (!TRANSLATIONS[language]) {
      console.warn(`Language "${language}" is not available, using default language "${DEFAULT_LANGUAGE}"`);
      return TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;
    }
    
    return (TRANSLATIONS[language] as Record<string, string>)[key] || 
           TRANSLATIONS[DEFAULT_LANGUAGE][key] || 
           key;
  }, [language]);

  return {
    language,
    setLanguage,
    t
  };
};

// Helper to detect browser language
export const detectBrowserLanguage = (): Language => {
  const browserLanguage = navigator.language.split('-')[0] as Language;
  return TRANSLATIONS[browserLanguage] ? browserLanguage : DEFAULT_LANGUAGE;
};
