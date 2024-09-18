import clsx from "clsx";
import { TbExternalLink } from "@react-icons/all-files/tb/TbExternalLink";

type Props = { href: string; size?: "default" | "sm"; children: string };

export const ExternalLink: React.FC<Props> = ({
  href,
  size = "default",
  children,
}) => {
  const linkSizeClass = { default: "text-base gap-1", sm: "text-sm gap-[2px]" };
  const iconSizeClass = { default: 16, sm: 14 };

  return (
    <a
      href={href}
      target="_blank"
      className={clsx(
        "flex items-center underline underline-offset-4 transition-colors hover:text-zinc-50 w-fit",
        linkSizeClass[size]
      )}
    >
      {children}
      <TbExternalLink size={iconSizeClass[size]} className="text-zinc-400" />
    </a>
  );
};
