import { type Root } from "hast";
import { Toc } from "./toc";

type Props = { hast: Root };

export const DesktopToc: React.FC<Props> = async ({ hast }) => {
  return (
    <div className="sticky flex flex-col top-[16px] max-h-[calc(100dvh-32px)] h-fit py-4 rounded-lg border border-zinc-700 shadow-xl w-full">
      <p className="text-sm text-zinc-400 px-6">目次</p>
      <div className="w-full h-[1px] bg-zinc-700 my-2" />
      <div className="overflow-auto px-4">
        <Toc hast={hast} />
      </div>
    </div>
  );
};
