import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type ComponentPropsWithoutRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { TocAnchor } from "./toc-provider";
import { type Root } from "hast";

type Props = { hAst: Root };

// tocbotを使用するとビルド時にレンダリングできないので、unifiedを使って実装する
export const Toc: React.FC<Props> = ({ hAst }) => {
  return toJsxRuntime(hAst, {
    Fragment,
    jsx,
    jsxs,
    components: { ul: Ul, a: TocAnchor },
  });
};

const Ul = (props: ComponentPropsWithoutRef<"ul">) => {
  // ルートのulにpl-2が当たらないようにする
  // eslint-disable-next-line better-tailwindcss/no-unregistered-classes
  return <ul className="ul group group-has-[ul]:pl-4" {...props} />;
};
