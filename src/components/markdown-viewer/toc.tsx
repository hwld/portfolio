import { Jsx, toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type ComponentPropsWithoutRef } from "react";
import { jsx as reactJsx, jsxs as reactJsxs } from "react/jsx-runtime";
import { TocAnchor } from "./toc-provider";
import { type Root } from "hast";

const jsx = reactJsx as Jsx;
const jsxs = reactJsxs as Jsx;

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
  return <ul className="ul group group-has-[ul]:pl-4" {...props} />;
};
