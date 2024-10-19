import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type ComponentPropsWithoutRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Anchor, TocContextProvider } from "./toc-provider";
import { type Root } from "hast";

type Props = { hast: Root };

// tocbotを使用するとビルド時にレンダリングできないので、unifiedを使って実装する
export const Toc: React.FC<Props> = async ({ hast }) => {
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
