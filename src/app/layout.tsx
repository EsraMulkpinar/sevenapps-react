import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";
import ErrorBoundary from "../components/ErrorBoundary";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ]
}

export const metadata: Metadata = {
  title: "Markdown Editor",
  description: "A fast, modern markdown editor with live preview",
  keywords: ["markdown", "editor", "preview", "writing"],
  authors: [{ name: "Seven Apps" }],
  robots: "index, follow",
  openGraph: {
    title: "Markdown Editor",
    description: "A fast, modern markdown editor with live preview",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className="antialiased transition-colors duration-200 font-sans"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
