"use client";

import { useCallback, forwardRef, useImperativeHandle, useRef } from "react";
import FullscreenButton from "./FullscreenButton";

interface EditorProps {
  value: string;
  onMarkdownChange: (markdown: string) => void;
  isFullscreen?: boolean;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export interface EditorRef {
  focus: () => void;
}

const Editor = forwardRef<EditorRef, EditorProps>(({ 
  value, 
  onMarkdownChange, 
  isFullscreen = false, 
  onFullscreenToggle 
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onMarkdownChange(e.target.value);
    },
    [onMarkdownChange]
  );

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    }
  }), []);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-white dark:bg-gray-900' : 'w-full md:w-1/2'} p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
      {onFullscreenToggle && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Editor</h3>
          <FullscreenButton 
            onToggle={onFullscreenToggle}
            isFullscreen={isFullscreen}
            title="Editor"
          />
        </div>
      )}
      <textarea
        ref={textareaRef}
        className="w-full flex-1 p-4 font-mono resize-none outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        value={value}
        onChange={handleChange}
        placeholder="Type your markdown here..."
        aria-label="Markdown editor"
        style={{
          backgroundColor: 'var(--background)', 
          color: 'var(--foreground)'
        }}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;