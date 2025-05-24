"use client";

import { useEffect, useState, useCallback } from 'react';
import { db } from '../db';

const isClient = () => typeof window !== 'undefined';

export function useDocument(id: number) {
  const [content, setContent] = useState<string>('# Hello, Markdown!');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isClient()) {
      setIsLoading(false);
      return;
    }

    let canceled = false;

    db.documents?.get(id).then(doc => {
      if (!canceled && doc?.content) {
        setContent(doc.content);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error(error);
      setIsLoading(false);
    });

    return () => {
      canceled = true;
    };
  }, [id]);

  const saveContent = useCallback((newContent: string) => {
    setContent(newContent);
    
    if (isClient()) {
    db.documents?.put({ id, content: newContent }).catch(console.error);
    }
  }, [id]);

  return { content, setContent, saveContent, isLoading };
}

export function useSetting(key: string, defaultValue: string) {
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    if (!isClient()) {
      return;
    }

    let canceled = false;

    db.settings?.get(key).then(setting => {
      if (!canceled && setting?.value) {
        setValue(setting.value);
      }
    }).catch(console.error);

    return () => {
      canceled = true;
    };
  }, [key]);

  const saveSetting = useCallback((newValue: string) => {
    setValue(newValue);
    
    if (isClient()) {
    db.settings?.put({ key, value: newValue }).catch(console.error);
    }
  }, [key]);

  return { value, saveSetting };
}
