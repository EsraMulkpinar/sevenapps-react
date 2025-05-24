"use client";

import { debounce } from '@/utils';
import { useState, useEffect } from 'react';

export function useMarkdownParser(markdown: string): string {
  const [html, setHtml] = useState<string>('');
  const [parserLoaded, setParserLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadParser = async () => {
      try {
        await Promise.all([
          import('unified'),
          import('remark-parse'),
          import('remark-gfm'),
          import('remark-rehype'),
          import('rehype-sanitize'),
          import('rehype-stringify'),
          import('rehype-prism-plus')
        ]);
        
        if (isMounted) {
          setParserLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load markdown parser:', error);
      }
    };
    
    loadParser();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    if (!parserLoaded) return;
    
    let isMounted = true;
    
    const parseMarkdown = async () => {
      try {
        const { unified } = await import('unified');
        const remarkParse = await import('remark-parse');
        const remarkGfm = await import('remark-gfm');
        const remarkRehype = await import('remark-rehype');
        const rehypeSanitize = await import('rehype-sanitize');
        const rehypeStringify = await import('rehype-stringify');
        const rehypePrism = await import('rehype-prism-plus');
        
        const result = await unified()
          .use(remarkParse.default)
          .use(remarkGfm.default)
          .use(remarkRehype.default, { allowDangerousHtml: true })
          .use(rehypeSanitize.default, {
            attributes: {
              '*': ['className'],
              'code': ['className', 'data-language'],
              'pre': ['className'],
              'a': ['href', 'target', 'rel'],
              'img': ['src', 'alt', 'title'],
            }
          })
          .use(rehypePrism.default, {
            ignoreMissing: true,
            showLineNumbers: true,
            defaultLanguage: 'text'
          })
          .use(rehypeStringify.default)
          .process(markdown);
        
        if (isMounted) {
          setHtml(String(result));
        }
      } catch (error) {
        console.error('Error parsing markdown:', error);
        if (isMounted) {
          setHtml('<p>Error parsing markdown</p>');
        }
      }
    };
    
    const debouncedParse = debounce(parseMarkdown, 300);
    debouncedParse();
    
    return () => {
      isMounted = false;
    };
  }, [markdown, parserLoaded]);
  
  return html;
}