import type { ReactNode } from "react";
import { BaseLayout } from "./base-layout";
import { AvatarIconLink } from "../avatar-icon";

type Props = { children: ReactNode };

export const DetailLayout: React.FC<Props> = ({ children }) => {
  return (
    <BaseLayout width="narrow">
      <AvatarIconLink />
      <div className="flex flex-col gap-10">{children}</div>
    </BaseLayout>
  );
};
