import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type ComponentPropsWithoutRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { Anchor, TocContextProvider } from "./toc-provider";
import { rehypeAddPrevHref, remarkToc } from "@/lib/unified-plugin";

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
