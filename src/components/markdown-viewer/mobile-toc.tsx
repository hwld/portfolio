import { type Root } from "hast";
import { MobileTocButton } from "./mobile-toc-button";
import { Toc } from "./toc";

type Props = { hast: Root };

export const mobileToCAvailableHeight = "--mobile-toc-available-height";
export const mobileToCAvailableWidth = "--mobile-toc-available-width";

export const MobileToc: React.FC<Props> = async ({ hast }) => {
  const margin = "16px";

  return (
    <div
      className="block min-[1200px]:hidden fixed"
      style={{ top: margin, right: margin }}
    >
      <MobileTocButton>
        <div
          className="flex flex-col py-4 rounded-lg h-fit bg-zinc-800 border border-zinc-500 shadow-xl w-full"
          style={{
            maxHeight: `calc(var(${mobileToCAvailableHeight}) - ${margin})`,
            maxWidth: `calc(var(${mobileToCAvailableWidth}) - ${margin})`,
          }}
        >
          <div className="overflow-auto px-4">
            <Toc hast={hast} />
          </div>
        </div>
      </MobileTocButton>
    </div>
  );
};
