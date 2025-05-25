"use client";

import { useCallback } from "react";

interface ExportButtonProps {
  htmlContent: string;
  filename?: string;
}

export default function ExportButton({ htmlContent, filename = "markdown-export" }: ExportButtonProps) {
  const handleExport = useCallback(() => {
    if (!htmlContent.trim()) {
      const notification = document.createElement('div');
      notification.textContent = 'No content to export';
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-3 py-2 rounded shadow-lg z-50';
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 2000);
      return;
    }

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    p { margin-bottom: 16px; }
    code {
      background: #f6f8fa;
      border-radius: 3px;
      font-size: 85%;
      margin: 0;
      padding: 0.2em 0.4em;
    }
    pre {
      background: #f6f8fa;
      border-radius: 6px;
      font-size: 85%;
      line-height: 1.45;
      overflow: auto;
      padding: 16px;
    }
    pre code {
      background: transparent;
      border: 0;
      display: inline;
      line-height: inherit;
      margin: 0;
      max-width: auto;
      overflow: visible;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
      display: block;
      max-width: 100%;
      overflow: auto;
      width: max-content;
    }
    th, td {
      border: 1px solid #d0d7de;
      padding: 6px 13px;
    }
    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    blockquote {
      border-left: 0.25em solid #d0d7de;
      color: #656d76;
      margin: 0;
      padding: 0 1em;
    }
    ul, ol {
      margin-bottom: 16px;
      padding-left: 2em;
    }
    li {
      margin-bottom: 0.25em;
    }
    li input[type="checkbox"] {
      margin-right: 0.5em;
    }
    a {
      color: #0969da;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    hr {
      background-color: #d0d7de;
      border: 0;
      height: 0.25em;
      margin: 24px 0;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.html`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const notification = document.createElement('div');
    notification.textContent = 'HTML file downloaded!';
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-3 py-2 rounded shadow-lg z-50';
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  }, [htmlContent, filename]);

  return (
    <button
      onClick={handleExport}
      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      title="Download HTML"
      aria-label="Download HTML"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
} 