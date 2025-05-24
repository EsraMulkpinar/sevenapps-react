"use client";

import { useEffect, useCallback, useMemo } from "react";
import Editor from "@components/Editor";
import Preview from "@components/Preview";
import SampleSelector from "@components/SampleSelector";
import ThemeToggle from "@components/ThemeToggle";
import { useDocument, useSetting } from "@hooks/useIndexedDB";
import { db } from "@/db";
import { debounce } from "@/utils";

export default function Home() {
  const { content, setContent, saveContent, isLoading } = useDocument(1);
  const { value: selectedSample, saveSetting: setSelectedSample } = useSetting("selectedSample", "hello");
  
  useEffect(() => {
    if (selectedSample) {
      db.samples?.get(selectedSample).then(sample => {
        if (sample?.content) {
          setContent(sample.content);
        }
      }).catch(console.error);
    }
  }, [selectedSample, setContent]);

  const debouncedSave = useMemo(
    () => debounce((newContent: string, sampleKey: string) => {
      saveContent(newContent);
      if (sampleKey) {
        db.samples?.put({ key: sampleKey, content: newContent }).catch(console.error);
      }
    }, 500),
    [saveContent]
  );

  const handleMarkdownChange = useCallback((newContent: string) => {
    setContent(newContent);
    debouncedSave(newContent, selectedSample);
  }, [setContent, debouncedSave, selectedSample]);

  const handleSampleSelect = useCallback((sampleKey: string, sampleContent: string) => {
    console.log('Sample selected:', sampleKey, 'Content length:', sampleContent.length);
    setSelectedSample(sampleKey);
    setContent(sampleContent);
    if (sampleKey) {
      db.samples?.put({ key: sampleKey, content: sampleContent }).catch(console.error);
    }
  }, [setSelectedSample, setContent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-screen transition-colors duration-200"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <div 
        className="p-4 flex justify-between items-center border-b transition-colors duration-200"
        style={{
          borderColor: 'var(--border-color)'
        }}
      >
        <SampleSelector 
          onSelect={handleSampleSelect} 
          currentSample={selectedSample} 
        />
        <ThemeToggle />
      </div>
      <div className="flex flex-col md:flex-row flex-1">
        <Editor value={content} onMarkdownChange={handleMarkdownChange} />
        <Preview content={content} />
      </div>
    </div>
  );
}