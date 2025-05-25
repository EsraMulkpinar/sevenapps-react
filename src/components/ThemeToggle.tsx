"use client";

import { useEffect } from 'react';
import { useSetting } from '@hooks/useIndexedDB';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';

export default function ThemeToggle() {
  const { value: theme, saveSetting: setTheme } = useSetting('theme', 'system');
  
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  useKeyboardShortcuts({
    onThemeToggle: toggleTheme,
    isEnabled: true
  });
  
  useEffect(() => {
    const root = document.documentElement;
    const html = document.querySelector('html');
    root.classList.remove('light', 'dark');
    html?.classList.remove('light', 'dark');
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        html?.classList.add('dark');
        document.body.style.setProperty('--background', '#0a0a0a');
        document.body.style.setProperty('--foreground', '#ededed');
      } else {
        root.classList.add('light');
        html?.classList.add('light');
        document.body.style.setProperty('--background', '#ffffff');
        document.body.style.setProperty('--foreground', '#171717');
      }
    };
    
    let cleanup: (() => void) | undefined;
    
    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark');
        html?.classList.remove('light', 'dark');
        applyTheme(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      cleanup = () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    document.body.classList.add('theme-updated');
    const timeoutId = setTimeout(() => {
      document.body.classList.remove('theme-updated');
    }, 10);
    
    return () => {
      clearTimeout(timeoutId);
      cleanup?.();
    };
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-all duration-200 
      text-gray-900 dark:text-gray-200
      hover:bg-gray-200 hover:shadow-sm active:scale-95 
      dark:hover:bg-gray-700
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      aria-label="Toggle theme"
    >
      {theme === 'light' && (
        <>
          <SunIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <span>Light</span>
        </>
      )}
      {theme === 'dark' && (
        <>
          <MoonIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span>Dark</span>
        </>
      )}
      {theme === 'system' && (
        <>
          <ComputerIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span>System</span>
        </>
      )}
    </button>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ComputerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}