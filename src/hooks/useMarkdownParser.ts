"use client";

import { useState, useCallback, useMemo, useRef } from 'react';
import { debounce } from '@/utils';

type UnifiedProcessor = {
  use: (plugin: unknown, ...args: unknown[]) => UnifiedProcessor;
  process: (content: string) => Promise<{ toString(): string }>;
};

type ProcessorResult = { toString(): string };

interface MarkdownParserModules {
  unified: () => UnifiedProcessor;
  remarkParse: { default: () => void };
  remarkGfm: { default: () => void };
  remarkRehype: { default: (options?: { allowDangerousHtml?: boolean }) => void };
  rehypeSanitize: { default: (options?: Record<string, unknown>) => void };
  rehypeStringify: { default: () => void };
}

let globalParserModules: MarkdownParserModules | null = null;
let globalLoadingPromise: Promise<MarkdownParserModules> | null = null;

const loadParserModules = async (): Promise<MarkdownParserModules> => {
  if (globalParserModules) {
    return globalParserModules;
  }

  if (globalLoadingPromise) {
    return globalLoadingPromise;
  }

  globalLoadingPromise = (async () => {
    try {
      const [
        { unified },
        remarkParse,
        remarkGfm,
        remarkRehype,
        rehypeSanitize,
        rehypeStringify
      ] = await Promise.all([
        import('unified'),
        import('remark-parse'),
        import('remark-gfm'),
        import('remark-rehype'),
        import('rehype-sanitize'),
        import('rehype-stringify')
      ]);

      const modules: MarkdownParserModules = {
        unified: unified as () => UnifiedProcessor,
        remarkParse,
        remarkGfm,
        remarkRehype,
        rehypeSanitize,
        rehypeStringify
      };

      globalParserModules = modules;
      return modules;
    } catch (error) {
      globalLoadingPromise = null;
      throw error;
    }
  })();

  return globalLoadingPromise;
};

export function useMarkdownParser(markdown: string): { html: string; isLoading: boolean; triggerProcess: () => void } {
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const processorRef = useRef<UnifiedProcessor | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const getOrCreateProcessor = useCallback(async (): Promise<UnifiedProcessor> => {
    if (processorRef.current) {
      return processorRef.current;
    }

    const modules = await loadParserModules();
    
    processorRef.current = modules.unified()
      .use(modules.remarkParse.default)
      .use(modules.remarkGfm.default)
      .use(modules.remarkRehype.default, { allowDangerousHtml: false })
      .use(modules.rehypeSanitize.default, {
        attributes: {
          '*': ['className', 'id'],
          'code': ['className', 'data-language'],
          'pre': ['className'],
          'a': ['href', 'target', 'rel'],
          'img': ['src', 'alt', 'title', 'width', 'height'],
          'table': ['className'],
          'thead': ['className'],
          'tbody': ['className'],
          'tr': ['className'],
          'th': ['className', 'scope'],
          'td': ['className'],
          'input': ['type', 'checked', 'disabled'],
          'div': ['className'],
          'ol': ['className'],
          'li': ['className'],
        },
        tagNames: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's', 'del',
          'ul', 'ol', 'li',
          'blockquote', 'pre', 'code',
          'a', 'img',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'div', 'span',
          'input',
          'hr'
        ]
      })
      .use(modules.rehypeStringify.default);

    return processorRef.current;
  }, []);
    
  const processMarkdown = useCallback(async (content: string): Promise<void> => {
    if (!content.trim()) {
      setHtml('');
      return;
    }

    try {
      setIsLoading(true);
      const processor = await getOrCreateProcessor();
      const result: ProcessorResult = await processor.process(content);
      setHtml(result.toString());
    } catch (error) {
      console.error('Error processing markdown:', error);
      setHtml('<p>Error: Failed to process markdown</p>');
    } finally {
      setIsLoading(false);
    }
  }, [getOrCreateProcessor]);

  const debouncedProcess = useMemo(
    () => debounce(processMarkdown, 500),
    [processMarkdown]
  );

  const processIfNeeded = useCallback((content: string) => {
    if (!content.trim()) {
      setHtml('');
      setIsLoading(false);
      return;
    }

    if (!isInitializedRef.current && content.length < 10) {
      setHtml('');
      return;
    }

    isInitializedRef.current = true;
    debouncedProcess(content);
  }, [debouncedProcess]);

  const triggerProcess = useCallback(() => {
    if (markdown.trim()) {
      isInitializedRef.current = true;
      processMarkdown(markdown);
    }
  }, [markdown, processMarkdown]);

  useMemo(() => {
    processIfNeeded(markdown);
  }, [markdown, processIfNeeded]);

  return { 
    html, 
    isLoading,
    triggerProcess 
  };
}