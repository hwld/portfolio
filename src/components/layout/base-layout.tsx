import clsx from "clsx";
import type { ReactNode } from "react";

type Props = { children: ReactNode; width?: "wide" | "narrow" };

export const BaseLayout: React.FC<Props> = ({ children, width = "wide" }) => {
  return (
    <div
      className={clsx(
        "relative m-auto min-h-dvh max-w-[1000px] px-6 pt-8 pb-32 md:px-12 md:pt-14"
      )}
    >
      <div
        className={clsx(
          "flex h-full flex-col gap-14",
          width === "narrow" ? "max-w-[700px]" : "w-full"
        )}
      >
        {children}
      </div>
    </div>
  );
};
