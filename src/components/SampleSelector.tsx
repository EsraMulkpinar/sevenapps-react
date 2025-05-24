"use client";

import { useSetting } from "@hooks/useIndexedDB";
import { db } from "@/db";
import { useEffect, useState, useCallback } from "react";

interface SampleSelectorProps {
  onSelect: (key: string, content: string) => void;
  currentSample: string;
}

interface Sample {
  label: string;
  path: string;
}

interface SampleData {
  [key: string]: Sample;
}

const samples: SampleData = {
  hello: { label: "Hello", path: "hello.md" },
  intro: { label: "Intro", path: "intro.md" },
  features: { label: "Features", path: "features.md" },
  usage: { label: "Usage", path: "usage.md" },
};

const sampleImports = {
  hello: () => import("@samples/hello.md"),
  intro: () => import("@samples/intro.md"),
  features: () => import("@samples/features.md"), 
  usage: () => import("@samples/usage.md"),
};

export default function SampleSelector({ onSelect, currentSample }: SampleSelectorProps) {
  const { value: selected, saveSetting: setSelected } = useSetting(
    "selectedSample",
    currentSample
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSampleLoad = useCallback(async (key: string) => {
    if (!key || !samples[key as keyof typeof samples]) return;

    setIsLoading(true);
    setError(null);

    try {
      const savedSample = await db.samples?.get(key);
      let content: string;
      
      if (savedSample?.content) {
        content = savedSample.content;
      } else {
        const importFn = sampleImports[key as keyof typeof sampleImports];
        if (!importFn) {
          throw new Error(`Import function not found for ${key}`);
        }
        const mod = await importFn();
        content = mod.default;
        await db.samples?.put({ key, content });
      }
      
      onSelect(key, content);
    } catch (error) {
      console.error("Error loading sample:", error);
      setError("Failed to load sample. Please try again.");
      onSelect(key, "# Error loading sample\n\nPlease try again or select another sample.");
    } finally {
      setIsLoading(false);
    }
  }, [onSelect]);

  useEffect(() => {
    if (selected && selected !== currentSample) {
      handleSampleLoad(selected);
    }
  }, [selected, currentSample, handleSampleLoad]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelected(key);
    
    if (key) {
      await handleSampleLoad(key);
    } else {
      onSelect('', '# Hello, Markdown!\n\nStart typing to see live preview!');
    }
  }, [setSelected, handleSampleLoad, onSelect]);

  return (
    <div className="relative">
      <select
        value={currentSample}
        onChange={handleChange}
        disabled={isLoading}
        className={`appearance-none p-2 pl-3 pr-8 rounded-md transition-colors duration-200 
        bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
        border border-gray-200 dark:border-gray-700 
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
        hover:bg-gray-100 dark:hover:bg-gray-700
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          borderColor: "var(--border-color)",
        }}
      >
        {Object.entries(samples).map(([key, { label }]) => (
          <option 
            key={key} 
            value={key}
            className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        )}
      </div>
      {error && (
        <div className="absolute top-full left-0 mt-1 text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}