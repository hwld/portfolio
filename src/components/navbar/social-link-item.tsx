import type { IconType } from "@react-icons/all-files";
import clsx from "clsx";
import type { PointerEventHandler } from "react";

type Props = {
  icon: IconType;
  href: string;
  onPointerEnter?: PointerEventHandler;
};

export const SocialLinkItem: React.FC<Props> = ({
  icon: Icon,
  href,
  onPointerEnter,
}) => {
  return (
    <a
      target="_blank"
      href={href}
      className={clsx(
        "size-8 grid place-items-center rounded-lg shrink-0 border border-zinc-600",
        onPointerEnter ? "" : "transition-all hover:bg-zinc-600"
      )}
      onPointerEnter={onPointerEnter}
    >
      <Icon className="size-5" />
    </a>
  );
};
