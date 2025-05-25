"use client";

import { useCallback } from "react";

interface FullscreenButtonProps {
  onToggle: (isFullscreen: boolean) => void;
  isFullscreen: boolean;
  title: string;
}

export default function FullscreenButton({ onToggle, isFullscreen, title }: FullscreenButtonProps) {
  const handleClick = useCallback(() => {
    onToggle(!isFullscreen);
  }, [onToggle, isFullscreen]);

  return (
    <button
      onClick={handleClick}
      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      title={isFullscreen ? `Exit ${title} fullscreen` : `${title} fullscreen`}
      aria-label={isFullscreen ? `Exit ${title} fullscreen` : `${title} fullscreen`}
    >
      {isFullscreen ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m2.5-2.5L1 1M16 3v3a2 2 0 0 0 2 2h3M18.5 5.5L23 1M8 21v-3a2 2 0 0 1-2-2H3m2.5 2.5L1 23M16 21v-3a2 2 0 0 0 2-2h3M18.5 18.5L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m6-5 5 5M16 3h3a2 2 0 0 1 2 2v3m-5-5-5 5M8 21H5a2 2 0 0 1-2-2v-3m6 5-5-5M16 21h3a2 2 0 0 0 2-2v-3m-5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
} 