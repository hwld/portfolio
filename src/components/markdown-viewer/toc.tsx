import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Root } from "mdast";
import { toc } from "mdast-util-toc";
import { Fragment, type ComponentPropsWithoutRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { Anchor, TocContextProvider } from "./toc-provider";
import { visit } from "unist-util-visit";
import { Element } from "hast";
import { HEADING_ID_PREFIX } from "./markdown-viewer";

type Props = { markdown: string };

export const Toc: React.FC<Props> = async ({ markdown }) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkRehype)
    .use(rehypeAddPrevHref);

  const mdast = processor.parse(markdown);
  const hast = await processor.run(mdast);

  return (
    // TODO
    <div className="fixed right-0 top-0 p-4 border rounded-lg">
      <TocContextProvider>
        {toJsxRuntime(hast, {
          Fragment,
          // @ts-ignore
          jsx,
          // @ts-ignore
          jsxs,
          components: { ul: Ul, a: Anchor },
        })}
      </TocContextProvider>
    </div>
  );
};

const Ul = (props: ComponentPropsWithoutRef<"ul">) => {
  // ルートのulにpl-2が当たらないようにする
  return <ul className="ul group group-has-[ul]:pl-4" {...props} />;
};

const remarkToc = () => {
  return (tree: Root) => {
    const result = toc(tree, { prefix: HEADING_ID_PREFIX });
    tree.children = result.map ? [result.map] : [];
  };
};

export const DATA_PREV_HREF = "data-prev-href";

const rehypeAddPrevHref = () => {
  return (tree: Element) => {
    let previousHref: string | null = null;

    visit(tree, "element", (node: Element) => {
      if (node.tagName === "a" && node.properties?.href) {
        node.properties["data-prev-href"] = previousHref;
        previousHref = node.properties.href as string;
      }
    });
  };
};
