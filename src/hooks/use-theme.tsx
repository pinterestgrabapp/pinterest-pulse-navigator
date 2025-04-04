
import { createContext, useContext, ReactNode, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
}

const initialState: ThemeProviderState = {
  theme: 'dark',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  storageKey = 'pinterest-grab-theme',
  ...props
}: ThemeProviderProps) {
  // Always use dark theme for this app
  const theme: Theme = 'dark';
  
  // Apply dark class to document root
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      // Remove both classes first
      root.classList.remove('light');
      root.classList.remove('dark');
      
      // Add the dark class
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
