"use client";

import React, { memo } from "react";
import { useMarkdownParser } from "@hooks/useMarkdownParser";
import FullscreenButton from "./FullscreenButton";
import ExportButton from "./ExportButton";

interface PreviewProps {
  content: string;
  isFullscreen?: boolean;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

function Preview({ content, isFullscreen = false, onFullscreenToggle }: PreviewProps) {
  const { html, isLoading } = useMarkdownParser(content);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-white dark:bg-gray-900' : 'w-full md:w-1/2'} p-4 border-l border-gray-200 dark:border-gray-700 flex flex-col`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h3>
        <div className="flex items-center gap-1">
          <ExportButton htmlContent={html} />
          {onFullscreenToggle && (
            <FullscreenButton 
              onToggle={onFullscreenToggle}
              isFullscreen={isFullscreen}
              title="Preview"
            />
          )}
        </div>
      </div>
      <div
        className="markdown-body w-full flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-md transition-colors duration-200 relative"
        style={{
          backgroundColor: 'var(--background)', 
          color: 'var(--foreground)'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 bg-opacity-75 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Processing markdown...</span>
            </div>
          </div>
        )}
        {!content.trim() ? (
          <div className="text-gray-400 dark:text-gray-500 italic text-center py-8">
            Start typing to see the preview...
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </div>
  );
}

export default memo(Preview, (prevProps, nextProps) => {
  return prevProps.content === nextProps.content && 
         prevProps.isFullscreen === nextProps.isFullscreen;
});