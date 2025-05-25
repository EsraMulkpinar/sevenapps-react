"use client";

import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import Editor, { EditorRef } from "@components/Editor";
import Preview from "@components/Preview";
import SampleSelector from "@components/SampleSelector";
import ThemeToggle from "@components/ThemeToggle";
import ShortcutsHelp from "@components/ShortcutsHelp";
import { useDocument, useSetting } from "@hooks/useIndexedDB";
import { useSamples } from "@hooks/useSamples";
import { useKeyboardShortcuts } from "@hooks/useKeyboardShortcuts";
import { debounce } from "@/utils";

const isMac = () => {
  return typeof window !== 'undefined' && 
    (navigator.platform.indexOf('Mac') > -1 || navigator.userAgent.indexOf('Mac') > -1);
};

export default function Home() {
  const { content, setContent, saveContent, isLoading } = useDocument(1);
  const { value: selectedSample, saveSetting: setSelectedSample } = useSetting("selectedSample", "hello");
  const { samples, getSample, updateSample } = useSamples();
  const editorRef = useRef<EditorRef>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  
  const isKeyboardTriggered = useRef(false);
  
  useEffect(() => {
    if (selectedSample && samples.length > 0 && !isKeyboardTriggered.current) {
      console.log('📂 Loading sample from useEffect:', selectedSample);
      getSample(selectedSample).then(sample => {
        if (sample?.content) {
          setContent(sample.content);
        }
      }).catch(console.error);
    }
    isKeyboardTriggered.current = false;
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

  const handleSave = useCallback(() => {
    saveContent(content);
    const saveIndicator = document.createElement('div');
    saveIndicator.textContent = 'Saved!';
    saveIndicator.className = 'fixed top-4 right-4 bg-green-500 text-white px-3 py-2 rounded shadow-lg z-50';
    document.body.appendChild(saveIndicator);
    setTimeout(() => {
      document.body.removeChild(saveIndicator);
    }, 2000);
  }, [saveContent, content]);

  const handleSampleSelectByKey = useCallback(async (sampleKey: string) => {
    isKeyboardTriggered.current = true;
    try {
      const sample = await getSample(sampleKey);
      if (sample?.content) {
        setSelectedSample(sampleKey);
        setContent(sample.content);
        updateSample(sampleKey, sample.content);

        const indicator = document.createElement('div');
        indicator.textContent = `Switched to: ${sample.title}`;
        indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50';
        document.body.appendChild(indicator);
        setTimeout(() => {
          document.body.removeChild(indicator);
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Error switching sample:', error);
      isKeyboardTriggered.current = false;
    }
  }, [getSample, setSelectedSample, setContent, updateSample]);

    const handleThemeToggle = useCallback(() => {
    }, []);

  const handleFocusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const handleToggleHelp = useCallback(() => {
    setShowShortcutsHelp(prev => !prev);
  }, []);

  const { shortcuts } = useKeyboardShortcuts({
    onSave: handleSave,
    onSampleSelect: handleSampleSelectByKey,
    onThemeToggle: handleThemeToggle,
    onFocusEditor: handleFocusEditor,
    onToggleHelp: handleToggleHelp,
    isEnabled: !showShortcutsHelp 
  });

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
        <div className="flex items-center gap-2">
          <ShortcutsHelp shortcuts={shortcuts} />
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-col md:flex-row flex-1">
        <Editor ref={editorRef} value={content} onMarkdownChange={handleMarkdownChange} />
        <Preview content={content} />
      </div>

      {showShortcutsHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 font-mono">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isMac() ? 'Press ⇧ + ?' : 'Press Ctrl + ?'} to toggle this help
              </p>
              {isMac() && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Note: Use ⌘ (Command) key instead of Ctrl on Mac
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}