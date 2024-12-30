import type { ReactNode } from "react";
import { BaseLayout } from "./base-layout";
import { AvatarIconLink } from "../avatar-icon";
import { TbHash } from "@react-icons/all-files/tb/TbHash";

type Props = {
  children: ReactNode;
  width?: "wide" | "narrow";

  pageTitle: string;
  pageSubTitle: string;
  pageDescription?: ReactNode;

  hideAvatar?: boolean;
};

export const SummaryLayout: React.FC<Props> = ({
  children,
  width,
  pageTitle,
  pageSubTitle,
  pageDescription,
  hideAvatar,
}) => {
  return (
    <BaseLayout width={width}>
      {hideAvatar ? null : <AvatarIconLink />}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="flex flex-col gap-1">
            <div className="text-zinc-400 text-xs">{pageSubTitle}</div>
            <div className="flex items-center gap-1 text-xl font-bold">
              <TbHash className="text-lg mt-[1px]" />
              {pageTitle}
            </div>
          </h1>
          {pageDescription ? (
            <div className="max-w-[700px] md:text-base">{pageDescription}</div>
          ) : null}
        </div>
        {children}
      </div>
    </BaseLayout>
  );
};
