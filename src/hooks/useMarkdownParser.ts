"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from '@/utils';

type UnifiedProcessor = any;
type ProcessorResult = { toString(): string };

interface MarkdownParserModules {
  unified: any;
  remarkParse: any;
  remarkGfm: any;
  remarkRehype: any;
  rehypeSanitize: any;
  rehypeStringify: any;
  rehypePrism: any;
}

let parserModules: MarkdownParserModules | null = null;
let parserLoadingPromise: Promise<MarkdownParserModules> | null = null;

const loadParserModules = async (): Promise<MarkdownParserModules> => {
  if (parserModules) {
    return parserModules;
  }

  if (parserLoadingPromise) {
    return parserLoadingPromise;
  }

  parserLoadingPromise = (async () => {
    try {
      const [
        { unified },
        remarkParse,
        remarkGfm,
        remarkRehype,
        rehypeSanitize,
        rehypeStringify,
        rehypePrism
      ] = await Promise.all([
        import('unified'),
        import('remark-parse'),
        import('remark-gfm'),
        import('remark-rehype'),
        import('rehype-sanitize'),
        import('rehype-stringify'),
        import('rehype-prism-plus')
      ]);

      const modules: MarkdownParserModules = {
        unified,
        remarkParse,
        remarkGfm,
        remarkRehype,
        rehypeSanitize,
        rehypeStringify,
        rehypePrism
      };

      parserModules = modules;
      return modules;
    } catch (error) {
      parserLoadingPromise = null;
      throw error;
    }
  })();

  return parserLoadingPromise;
};

export function useMarkdownParser(markdown: string): { html: string; isLoading: boolean } {
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [parserReady, setParserReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const initializeParser = async () => {
      try {
        await loadParserModules();
        if (isMounted) {
          setParserReady(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load markdown parser:', error);
        if (isMounted) {
          setHtml('<p>Error: Failed to load markdown parser</p>');
          setIsLoading(false);
        }
      }
    };

    initializeParser();

    return () => {
      isMounted = false;
    };
  }, []);

  const createProcessor = useCallback(async (): Promise<UnifiedProcessor> => {
    const modules = await loadParserModules();
    
    return modules.unified()
      .use(modules.remarkParse.default)
      .use(modules.remarkGfm.default)
      .use(modules.remarkRehype.default, { allowDangerousHtml: false })
      .use(modules.rehypeSanitize.default, {
        attributes: {
          '*': ['className'],
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
        },
        tagNames: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's',
          'ul', 'ol', 'li',
          'blockquote', 'pre', 'code',
          'a', 'img',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'div', 'span'
        ]
      })
      .use(modules.rehypePrism.default, {
        ignoreMissing: true,
        showLineNumbers: true,
        defaultLanguage: 'text'
      })
      .use(modules.rehypeStringify.default);
  }, []);
    
  const processMarkdown = useCallback(async (content: string): Promise<void> => {
    if (!parserReady || !content.trim()) {
      setHtml('');
      return;
    }

    try {
      setIsLoading(true);
      const processor = await createProcessor();
      const result: ProcessorResult = await processor.process(content);
      setHtml(String(result));
    } catch (error) {
      console.error('Error processing markdown:', error);
      setHtml('<p>Error: Failed to process markdown</p>');
    } finally {
      setIsLoading(false);
    }
  }, [parserReady, createProcessor]);

  const debouncedProcess = useMemo(
    () => debounce(processMarkdown, 150),
    [processMarkdown]
  );

  useEffect(() => {
    if (parserReady) {
      debouncedProcess(markdown);
    }

    return () => {
      debouncedProcess.cancel?.();
    };
  }, [markdown, parserReady, debouncedProcess]);

  return { html, isLoading };
}