import type { Root } from "mdast";
import type { Element } from "hast";
import { toc } from "mdast-util-toc";
import { visit } from "unist-util-visit";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export const getTocHAst = async (markdown: string) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkRehype)
    .use(rehypeAddPrevHref);

  const mdast = processor.parse(markdown);
  const hast = await processor.run(mdast);

  return hast;
};

export const HEADING_ID_PREFIX = "id-";

export const remarkToc = () => {
  return (tree: Root) => {
    const result = toc(tree, { prefix: HEADING_ID_PREFIX });
    tree.children = result.map ? [result.map] : [];
  };
};

export const DATA_PREV_HREF = "data-prev-href";

export const rehypeAddPrevHref = () => {
  return (tree: Element) => {
    let previousHref: string | null = null;

    visit(tree, "element", (node: Element) => {
      if (node.tagName === "a" && node.properties?.href) {
        node.properties[DATA_PREV_HREF] = previousHref;
        previousHref = node.properties.href as string;
      }
    });
  };
};
