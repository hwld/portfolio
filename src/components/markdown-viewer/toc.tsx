import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type ComponentPropsWithoutRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Anchor } from "./toc-provider";
import { type Root } from "hast";

type Props = { hast: Root };

// tocbotを使用するとビルド時にレンダリングできないので、unifiedを使って実装する
export const Toc: React.FC<Props> = async ({ hast }) => {
  return toJsxRuntime(hast, {
    Fragment,
    // @ts-ignore
    jsx,
    // @ts-ignore
    jsxs,
    components: { ul: Ul, a: Anchor },
  });
};

const Ul = (props: ComponentPropsWithoutRef<"ul">) => {
  // ルートのulにpl-2が当たらないようにする
  return <ul className="ul group group-has-[ul]:pl-4" {...props} />;
};
