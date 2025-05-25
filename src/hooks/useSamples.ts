"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '../db';

interface Sample {
  key: string;
  content: string;
  title: string;
}

const SAMPLE_FILES = [
  { key: 'hello', title: 'Hello World', importFn: () => import('@samples/hello.md') },
  { key: 'intro', title: 'Introduction', importFn: () => import('@samples/intro.md') },
  { key: 'features', title: 'Features', importFn: () => import('@samples/features.md') },
  { key: 'usage', title: 'Usage Guide', importFn: () => import('@samples/usage.md') }
];

export function useSamples() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSampleFile = useCallback(async (sampleConfig: typeof SAMPLE_FILES[0]): Promise<string> => {
    try {
      const moduleContent = await sampleConfig.importFn();
      return moduleContent.default || '';
    } catch (error) {
      console.error(`Error loading sample file ${sampleConfig.key}:`, error);
      return `# Error\n\nCould not load ${sampleConfig.key}`;
    }
  }, []);

  const initializeSamples = useCallback(async () => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if ('samples' in db && db.samples) {
        const existingSamples = await db.samples.toArray();
        
        if (existingSamples.length === 0) {
          const loadedSamples: Sample[] = [];
          
          for (const sampleConfig of SAMPLE_FILES) {
            const content = await loadSampleFile(sampleConfig);
            const sample: Sample = {
              key: sampleConfig.key,
              content,
              title: sampleConfig.title
            };
            
            await db.samples.put({ key: sample.key, content: sample.content });
            loadedSamples.push(sample);
          }
          
          setSamples(loadedSamples);
        } else {
          const samplesWithTitles = existingSamples.map(sample => {
            const config = SAMPLE_FILES.find(f => f.key === sample.key);
            return {
              ...sample,
              title: config?.title || sample.key
            };
          });
          setSamples(samplesWithTitles);
        }
      }
    } catch (error) {
      console.error('Error initializing samples:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadSampleFile]);

  useEffect(() => {
    initializeSamples();
  }, [initializeSamples]);

  const getSample = useCallback(async (key: string): Promise<Sample | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      if ('samples' in db && db.samples) {
        const sample = await db.samples.get(key);
        if (sample) {
          const config = SAMPLE_FILES.find(f => f.key === key);
          return {
            ...sample,
            title: config?.title || key
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting sample:', error);
      return null;
    }
  }, []);

  const updateSample = useCallback(async (key: string, content: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    
    try {
      if ('samples' in db && db.samples) {
        await db.samples.put({ key, content });
        setSamples(prev => prev.map(sample => 
          sample.key === key ? { ...sample, content } : sample
        ));
      }
    } catch (error) {
      console.error('Error updating sample:', error);
    }
  }, []);

  return {
    samples,
    isLoading,
    getSample,
    updateSample
  };
} 