"use client";

import { useEffect, useState } from "react";
import { db } from "@/db";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initializeTheme = async () => {
      const root = document.documentElement;

      try {
        const themeSetting = await db.get('theme');
        let theme: 'dark' | 'light' | 'system';

        if (themeSetting?.value && ['dark', 'light', 'system'].includes(themeSetting.value)) {
          theme = themeSetting.value as 'dark' | 'light' | 'system';
        } else {
          theme = 'system';
          await db.put({ key: 'theme', value: theme });
        }

        const applyTheme = (isDark: boolean) => {
          root.classList.remove('light', 'dark');
          if (isDark) {
            root.classList.add('dark');
            document.body.style.setProperty('--background', '#0a0a0a');
            document.body.style.setProperty('--foreground', '#ededed');
          } else {
            root.classList.add('light');
            document.body.style.setProperty('--background', '#ffffff');
            document.body.style.setProperty('--foreground', '#171717');
          }
        };

        if (theme === 'dark') {
          applyTheme(true);
        } else if (theme === 'light') {
          applyTheme(false);
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          applyTheme(prefersDark);
        }
      } catch (error) {
        console.error("Failed to initialize theme:", error);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(prefersDark ? 'dark' : 'light');
      }

      setMounted(true);
    };

    initializeTheme();
  }, []);
  
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
} 