"use client";
import { type Root } from "hast";
import { MobileTocButton } from "./mobile-toc-button";
import { Toc } from "./toc";
import { useMediaQuery } from "@mantine/hooks";

type Props = { hAst: Root; mobileBreakPointPx: number };

export const mobileToCAvailableHeight = "--mobile-toc-available-height";
export const mobileToCAvailableWidth = "--mobile-toc-available-width";

export const MobileToc: React.FC<Props> = ({ hAst, mobileBreakPointPx }) => {
  const margin = "16px";
  const isMobile =
    useMediaQuery(`(max-width: ${mobileBreakPointPx}px)`) ?? false;

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed" style={{ top: margin, right: margin }}>
      <MobileTocButton>
        <div
          className="flex flex-col py-4 rounded-lg h-fit bg-background border border-border-strong shadow-xl w-full"
          style={{
            maxHeight: `calc(var(${mobileToCAvailableHeight}) - ${margin})`,
            maxWidth: `calc(var(${mobileToCAvailableWidth}) - ${margin})`,
          }}
        >
          <div className="overflow-auto px-4">
            <Toc hAst={hAst} />
          </div>
        </div>
      </MobileTocButton>
    </div>
  );
};
