"use client";

import { useEffect, useCallback, useMemo } from "react";
import Editor from "@components/Editor";
import Preview from "@components/Preview";
import SampleSelector from "@components/SampleSelector";
import ThemeToggle from "@components/ThemeToggle";
import { useDocument, useSetting } from "@hooks/useIndexedDB";
import { useSamples } from "@hooks/useSamples";
import { debounce } from "@/utils";

export default function Home() {
  const { content, setContent, saveContent, isLoading } = useDocument(1);
  const { value: selectedSample, saveSetting: setSelectedSample } = useSetting("selectedSample", "hello");
  const { samples, getSample, updateSample } = useSamples();
  
  useEffect(() => {
    if (selectedSample && samples.length > 0) {
      getSample(selectedSample).then(sample => {
        if (sample?.content) {
          setContent(sample.content);
        }
      }).catch(console.error);
    }
  }, [selectedSample, samples.length, getSample, setContent]);

  const debouncedSave = useMemo(
    () => debounce((newContent: string, sampleKey: string) => {
      saveContent(newContent);
      if (sampleKey) {
        updateSample(sampleKey, newContent);
      }
    }, 500),
    [saveContent, updateSample]
  );

  const handleMarkdownChange = useCallback((newContent: string) => {
    setContent(newContent);
    debouncedSave(newContent, selectedSample);
  }, [setContent, debouncedSave, selectedSample]);

  const handleSampleSelect = useCallback((sampleKey: string, sampleContent: string) => {
    setSelectedSample(sampleKey);
    setContent(sampleContent);
    updateSample(sampleKey, sampleContent);
  }, [setSelectedSample, setContent, updateSample]);

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