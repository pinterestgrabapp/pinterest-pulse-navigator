
import { createContext, useContext, ReactNode } from 'react';

type Theme = 'dark' | 'light'; // Expanded to support light mode as well

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
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
  defaultTheme = 'dark',
  storageKey = 'pinterest-grab-theme',
  ...props
}: ThemeProviderProps) {
  // Always set dark mode (or use defaultTheme if needed in future)
  const theme: Theme = defaultTheme;
  
  // Add dark class to document root
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light');
    root.classList.remove('dark');
    
    // Add the appropriate class
    root.classList.add(theme);
  }

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
