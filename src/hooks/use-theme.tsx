
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

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
  const [themeApplied, setThemeApplied] = useState(false);
  
  console.log("[ThemeProvider] Initial render with theme:", theme);
  
  // Apply dark class to document root
  useEffect(() => {
    console.log("[ThemeProvider] useEffect running for theme:", theme);
    
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      console.log("[ThemeProvider] Current root classes:", root.classList.toString());
      
      // Remove both classes first
      root.classList.remove('light');
      root.classList.remove('dark');
      
      // Add the dark class
      root.classList.add(theme);
      console.log("[ThemeProvider] Applied theme class:", theme);
      console.log("[ThemeProvider] Updated root classes:", root.classList.toString());
      
      setThemeApplied(true);
    }
  }, [theme]);

  const value = {
    theme,
  };

  console.log("[ThemeProvider] Rendering children, themeApplied:", themeApplied);

  // Apply the theme class directly during first render to prevent flash of unstyled content
  if (typeof window !== 'undefined' && !themeApplied) {
    const root = window.document.documentElement;
    if (!root.classList.contains('dark')) {
      root.classList.add('dark');
      console.log("[ThemeProvider] Direct application of 'dark' class");
    }
  }

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
