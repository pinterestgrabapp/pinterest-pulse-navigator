
import { createContext, useContext, ReactNode } from 'react';

type Theme = 'dark';

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
  // Always set dark mode
  const theme: Theme = 'dark';
  
  // Add dark class to document root
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
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
