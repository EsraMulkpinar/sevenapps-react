import { useEffect, useState } from "react";

export function useMarkdownParser(markdown: string) {
  const [html, setHtml] = useState<string>("Loading...");

  useEffect(() => {
    let isMounted = true;

    async function parse() {
      const { unified } = await import("unified");
      const remarkParse = (await import("remark-parse")).default;
      const remarkRehype = (await import("remark-rehype")).default;
      const rehypeStringify = (await import("rehype-stringify")).default;
      const rehypeSanitize = (await import("rehype-sanitize")).default;
      const { defaultSchema } = await import("hast-util-sanitize");

      const schema = {
        ...defaultSchema,
        attributes: {
          ...defaultSchema.attributes,
          a: [...(defaultSchema.attributes?.a || []), 'target', 'rel'],
          code: [...(defaultSchema.attributes?.code || []), 'className'],
        },
      };

      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize, schema)
        .use(rehypeStringify)
        .process(markdown);

      if (isMounted) {
        setHtml(String(file));
      }
    }

    parse();

    return () => {
      isMounted = false;
    };
  }, [markdown]);

  return html;
}
