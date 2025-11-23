import { type Root } from "hast";
import { Toc } from "./toc";

type Props = { hAst: Root };

export const DesktopToc: React.FC<Props> = async ({ hAst: hast }) => {
  return (
    <div className="sticky top-[16px] flex h-fit max-h-[calc(100dvh-32px)] w-full flex-col rounded-lg border border-border py-4 shadow-xl">
      <p className="px-6 text-sm text-foreground-muted">目次</p>
      <div className="my-2 h-px w-full bg-border" />
      <div className="overflow-auto px-4">
        <Toc hAst={hast} />
      </div>
    </div>
  );
};
