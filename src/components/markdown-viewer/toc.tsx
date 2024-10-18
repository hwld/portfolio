import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type ComponentPropsWithoutRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { Anchor, TocContextProvider } from "./toc-provider";
import { rehypeAddPrevHref, remarkToc } from "@/lib/unified-plugin";

type Props = { markdown: string };

// tocbotを使用するとビルド時にレンダリングできないので、unifiedを使って実装する
export const Toc: React.FC<Props> = async ({ markdown }) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkRehype)
    .use(rehypeAddPrevHref);

  const mdast = processor.parse(markdown);
  const hast = await processor.run(mdast);

  if (hast.children.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-4 h-fit p-4 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl w-full">
      <p className="text-sm text-zinc-400">目次</p>
      <div className="w-full h-[1px] bg-zinc-600 my-2" />
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
