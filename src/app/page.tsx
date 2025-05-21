"use client";

import { useState, useEffect } from "react";
import Editor from "@components/Editor";
import Preview from "@components/Preview";
import SampleSelector from "@components/SampleSelector";
import { useDocument } from "@hooks/useIndexedDB";

export default function Home() {
  const { content, saveContent } = useDocument(1);
  const [markdown, setMarkdown] = useState<string>("# Hello, Markdown!");

  useEffect(() => {
    if (content) setMarkdown(content);
  }, [content]);

  useEffect(() => {
    saveContent(markdown);
  }, [markdown, saveContent]);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 flex justify-between items-center">
        <SampleSelector onSelect={setMarkdown} />
      </div>
      <div className="flex flex-col md:flex-row flex-1">
        <Editor value={markdown} onMarkdownChange={setMarkdown} />
        <Preview content={markdown} />
      </div>
    </div>
  );
}
