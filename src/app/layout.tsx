"use client";

import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const initializeTheme = () => {
      const root = document.documentElement;
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme === 'dark' || savedTheme === 'light') {
        root.classList.add(savedTheme);
        document.body.style.setProperty('--background', savedTheme === 'dark' ? '#0a0a0a' : '#ffffff');
        document.body.style.setProperty('--foreground', savedTheme === 'dark' ? '#ededed' : '#171717');
      } else {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = isDarkMode ? 'dark' : 'light';
        root.classList.add(theme);
        document.body.style.setProperty('--background', isDarkMode ? '#0a0a0a' : '#ffffff');
        document.body.style.setProperty('--foreground', isDarkMode ? '#ededed' : '#171717');
      }
    };

    initializeTheme();
  }, []);

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <title>Markdown Playground</title>
        <meta name="description" content="Canlı Markdown Önizleme Uygulaması" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="transition-colors duration-200" suppressHydrationWarning>
        {mounted ? children : (
          <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}
      </body>
    </html>
  );
}