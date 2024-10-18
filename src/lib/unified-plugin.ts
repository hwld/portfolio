import type { Root } from "mdast";
import type { Element } from "hast";
import { toc } from "mdast-util-toc";
import { visit } from "unist-util-visit";

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
