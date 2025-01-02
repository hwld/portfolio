import type { IconType } from "@react-icons/all-files";
import clsx from "clsx";
import type { PointerEventHandler } from "react";

type Props = {
  icon: IconType;
  href: string;
  onPointerEnter?: PointerEventHandler;
  label: string;
};

export const SocialLinkItem: React.FC<Props> = ({
  icon: Icon,
  href,
  onPointerEnter,
  label,
}) => {
  return (
    <a
      aria-label={label}
      target="_blank"
      href={href}
      className={clsx(
        "size-8 grid place-items-center rounded-full shrink-0 hover:text-zinc-100 transition-colors hover:bg-zinc-700"
      )}
      onPointerEnter={onPointerEnter}
    >
      <Icon className="size-5" />
    </a>
  );
};
