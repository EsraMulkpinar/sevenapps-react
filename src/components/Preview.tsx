"use client";

import { useMarkdownParser } from "@hooks/useMarkdownParser";

interface PreviewProps {
  content: string;
}

export default function Preview({ content }: PreviewProps) {
  const { html, isLoading } = useMarkdownParser(content);

  return (
    <div className="w-full md:w-1/2 p-4 border-l border-gray-200 dark:border-gray-700">
      <div
        className="markdown-body w-full h-full p-4 overflow-auto bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-md transition-colors duration-200 relative"
        style={{
          backgroundColor: 'var(--background)', 
          color: 'var(--foreground)'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 bg-opacity-75">
            <div className="text-gray-500 dark:text-gray-400">
              Processing markdown...
            </div>
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}