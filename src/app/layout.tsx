'use client';

import { useEffect, useState } from "react";
import "./globals.css";
import { db } from "@/db";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initializeTheme = async () => {
      const root = document.documentElement;

      try {
        const themeSetting = await db.get('theme');
        let theme: 'dark' | 'light';

        if (themeSetting?.value === 'dark' || themeSetting?.value === 'light') {
          theme = themeSetting.value;
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          theme = prefersDark ? 'dark' : 'light';
          await db.put({ key: 'theme', value: theme });
        }

        root.classList.add(theme);
        document.body.style.setProperty('--background', theme === 'dark' ? '#0a0a0a' : '#ffffff');
        document.body.style.setProperty('--foreground', theme === 'dark' ? '#ededed' : '#171717');
      } catch (error) {
        console.error("Failed to initialize theme:", error);
      }

      setMounted(true);
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
