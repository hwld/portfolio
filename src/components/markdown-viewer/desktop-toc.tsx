import { type Root } from "hast";
import { Toc } from "./toc";

type Props = { hAst: Root };

export const DesktopToc: React.FC<Props> = async ({ hAst: hast }) => {
  return (
    <div className="sticky flex flex-col top-[16px] max-h-[calc(100dvh-32px)] h-fit py-4 rounded-lg border border-border shadow-xl w-full">
      <p className="text-sm text-foreground-muted px-6">目次</p>
      <div className="w-full h-[1px] bg-border my-2" />
      <div className="overflow-auto px-4">
        <Toc hAst={hast} />
      </div>
    </div>
  );
};
