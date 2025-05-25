"use client";

import { useCallback, forwardRef, useImperativeHandle, useRef } from "react";

interface EditorProps {
  value: string;
  onMarkdownChange: (markdown: string) => void;
}

export interface EditorRef {
  focus: () => void;
}

const Editor = forwardRef<EditorRef, EditorProps>(({ value, onMarkdownChange }, ref) => {
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
    <div className="w-full md:w-1/2 p-4 border-r border-gray-200 dark:border-gray-700">
      <textarea
        ref={textareaRef}
        className="w-full h-full p-4 font-mono resize-none outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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