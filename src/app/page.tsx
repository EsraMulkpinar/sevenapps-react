"use client";

import { useState } from "react";
import Editor from "@components/Editor";
import Preview from "@components/Preview";
import SampleSelector from "@components/SampleSelector";

export default function Home() {
  const [markdown, setMarkdown] = useState("# Hello, Markdown!");

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4">
        <SampleSelector onSelect={setMarkdown} />
      </div>
      <div className="flex flex-col md:flex-row flex-1">
        <Editor value={markdown} onMarkdownChange={setMarkdown} />
        <Preview content={markdown} />
      </div>
    </div>
  );
}
