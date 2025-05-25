"use client";

import { useState } from 'react';

interface Shortcut {
  keys: string;
  description: string;
}

interface ShortcutsHelpProps {
  shortcuts: Shortcut[];
}

const isMac = () => {
  return typeof window !== 'undefined' && 
    (navigator.platform.indexOf('Mac') > -1 || navigator.userAgent.indexOf('Mac') > -1);
};

export default function ShortcutsHelp({ shortcuts }: ShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modifierKey = isMac() ? '⌘' : 'Ctrl';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors 
        hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
        aria-label="Show keyboard shortcuts"
        title={`Keyboard shortcuts (${modifierKey} + ?)`}
      >
        <KeyboardIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Shortcuts</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 font-mono">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 border rounded dark:bg-gray-700 font-mono">{modifierKey} + ?</kbd> to toggle this help
              </p>
              {isMac() && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Note: Use ⌘ (Command) key instead of Ctrl on Mac
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function KeyboardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 8h.01" />
      <path d="M10 8h.01" />
      <path d="M14 8h.01" />
      <path d="M18 8h.01" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
      <path d="M7 16h10" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
} 