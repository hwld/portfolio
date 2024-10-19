import type { Root } from "mdast";
import type { Element } from "hast";
import { toc } from "mdast-util-toc";
import { visit } from "unist-util-visit";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export const getTocHAst = async (markdown: string) => {
  const processor = unified().use(remarkParse).use(remarkToc).use(remarkRehype);

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

export const DATA_PREV_HEADING_ID = "data-prev-heading-id";

export const rehypeAddPrevHeadingId = () => {
  return (tree: Element) => {
    let previousId: string | null = null;

    visit(tree, "element", (node: Element) => {
      if (
        ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName) &&
        node.properties?.id
      ) {
        node.properties[DATA_PREV_HEADING_ID] = previousId;
        previousId = node.properties.id as string;
      }
    });
  };
};
