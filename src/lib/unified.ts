import type { Root } from "mdast";
import { toc } from "mdast-util-toc";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import matter from "gray-matter";

export const getTocHAst = async (markdown: string) => {
  // front matterを除去する
  const { content } = matter(markdown);

  const processor = unified().use(remarkParse).use(remarkToc).use(remarkRehype);

  const mdast = processor.parse(content);
  const hast = await processor.run(mdast);

  return hast;
};

/**  heading要素のタイトルがidになり、タイトルの先頭が数字の場合はidに変換できないためプレフィックスを付与する */
export const HEADING_ID_PREFIX = "id-";

const remarkToc = () => {
  return (tree: Root) => {
    const result = toc(tree, { prefix: HEADING_ID_PREFIX });
    tree.children = result.map ? [result.map] : [];
  };
};
