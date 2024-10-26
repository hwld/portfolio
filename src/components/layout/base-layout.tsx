import clsx from "clsx";
import type { ReactNode } from "react";

type Props = { children: ReactNode; width?: "wide" | "narrow" };

export const BaseLayout: React.FC<Props> = ({ children, width = "wide" }) => {
  return (
    <div
      className={clsx(
        "relative pt-8 pb-32 m-auto px-6 md:pt-14 md:px-12 min-h-[100dvh] max-w-[1000px]"
      )}
    >
      <div
        className={clsx(
          "h-full flex flex-col gap-14",
          width === "narrow" ? "max-w-[700px]" : "w-full"
        )}
      >
        {children}
      </div>
    </div>
  );
};
