"use client";

import { useMarkdownParser } from "@hooks/useMarkdownParser";

interface PreviewProps {
  content: string;
}

export default function Preview({ content }: PreviewProps) {
  const html = useMarkdownParser(content);
  console.log("parsed HTML:", html);

  return (
    <div
      className="w-full md:w-1/2 p-4 overflow-auto bg-white text-black dark:bg-gray-900 dark:text-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
