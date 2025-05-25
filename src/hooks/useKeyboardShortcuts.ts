"use client";

import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsProps {
  onSave?: () => void;
  onSampleSelect?: (sampleKey: string) => void;
  onThemeToggle?: () => void;
  onFocusEditor?: () => void;
  onToggleHelp?: () => void;
  isEnabled?: boolean;
}

interface ShortcutMapping {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

const isMac = () => {
  return typeof window !== 'undefined' && 
    (navigator.platform.indexOf('Mac') > -1 || navigator.userAgent.indexOf('Mac') > -1);
};

export function useKeyboardShortcuts({
  onSave,
  onSampleSelect,
  onThemeToggle,
  onFocusEditor,
  onToggleHelp,
  isEnabled = true
}: KeyboardShortcutsProps) {

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    console.log('🎹 Key event:', {
      key: event.key,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
      isEnabled
    });

    if (!isEnabled) {
      return;
    }

    const shortcuts: ShortcutMapping[] = [
      {
        key: 's',
        ctrlKey: true,
        action: () => {
          onSave?.();
        },
        description: 'Save document',
        preventDefault: true
      },
      {
        key: 'h',
        ctrlKey: true,
        action: () => {
          onSampleSelect?.('hello');
        },
        description: 'Switch to Hello World sample',
        preventDefault: true
      },
      {
        key: '2',
        ctrlKey: true,
        action: () => {
          onSampleSelect?.('intro');
        },
        description: 'Switch to Introduction sample',
        preventDefault: true
      },
      {
        key: '3',
        ctrlKey: true,
        action: () => {
          onSampleSelect?.('features');
        },
        description: 'Switch to Features sample',
        preventDefault: true
      },
      {
        key: '4',
        ctrlKey: true,
        action: () => {
          onSampleSelect?.('usage');
        },
        description: 'Switch to Usage sample',
        preventDefault: true
      },
      {
        key: 'd',
        ctrlKey: true,
        action: () => {
          onThemeToggle?.();
        },
        description: 'Toggle dark/light theme',
        preventDefault: true
      },
      {
        key: 'e',
        ctrlKey: true,
        action: () => {
          onFocusEditor?.();
        },
        description: 'Focus editor',
        preventDefault: true
      },
      {
        key: '?',
        shiftKey: true,
        action: () => {
          onToggleHelp?.();
        },
        description: 'Toggle shortcuts help',
        preventDefault: true
      },
    ];

    for (const shortcut of shortcuts) {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const altMatches = shortcut.altKey ? event.altKey : !event.altKey;
      const shiftMatches = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;

      console.log('🔍 Checking shortcut:', {
        shortcutKey: shortcut.key,
        keyMatches,
        ctrlMatches,
        altMatches,
        shiftMatches,
        allMatch: keyMatches && ctrlMatches && altMatches && shiftMatches
      });

      if (keyMatches && ctrlMatches && altMatches && shiftMatches) {
        console.log('✅ Shortcut matched!', shortcut.description);
        if (shortcut.preventDefault) {
          event.preventDefault();
        }
        shortcut.action();
        break;
      }
    }
  }, [isEnabled, onSave, onSampleSelect, onThemeToggle, onFocusEditor, onToggleHelp]);

  useEffect(() => {
    
    if (typeof window === 'undefined' || !isEnabled) {
      return;
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, isEnabled]);

  const modifierKey = isMac() ? '⌘' : 'Ctrl';
  const shiftKey = isMac() ? 'Shift' : 'Shift';
  const shortcuts = [
    { keys: `${modifierKey} + S`, description: 'Save document' },
    { keys: `${modifierKey} + H`, description: 'Switch to Hello World' },
    { keys: `${modifierKey} + 2`, description: 'Switch to Introduction' },
    { keys: `${modifierKey} + 3`, description: 'Switch to Features' },
    { keys: `${modifierKey} + 4`, description: 'Switch to Usage' },
    { keys: `${modifierKey} + D`, description: 'Toggle theme' },
    { keys: `${modifierKey} + E`, description: 'Focus editor' },
    { keys: `${shiftKey} + ?`, description: 'Toggle shortcuts help' },
  ];

  return { shortcuts };
} 