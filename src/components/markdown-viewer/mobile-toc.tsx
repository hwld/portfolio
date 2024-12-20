import { type Root } from "hast";
import { MobileTocButton } from "./mobile-toc-button";
import { Toc } from "./toc";

type Props = { hast: Root };

export const mobileToCAvailableHeight = "--mobile-toc-available-height";

export const MobileToc: React.FC<Props> = async ({ hast }) => {
  return (
    <MobileTocButton>
      <div
        className={`flex flex-col py-4 rounded-lg h-fit bg-zinc-800 border border-zinc-700 shadow-xl w-full`}
        style={{ maxHeight: `calc(var(${mobileToCAvailableHeight}) - 16px)` }}
      >
        <div className="overflow-auto px-4">
          <Toc hast={hast} />
        </div>
      </div>
    </MobileTocButton>
  );
};
