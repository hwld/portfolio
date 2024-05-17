import { PageData } from "@/app/pages";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { ComponentProps } from "react";

type Props = {
  page: PageData;
  children: string;
  active?: boolean;
  onPointerEnter?: ComponentProps<"a">["onPointerEnter"];
};

export const NavbarItem: React.FC<Props> = ({
  page,
  children,
  active = false,
  onPointerEnter,
}) => {
  const Icon = page.icon;
  return (
    <Link
      href={page.url}
      onPointerEnter={onPointerEnter}
      className={clsx(
        "flex gap-1 text-right transition-colors items-center w-full h-full justify-center px-3 focus-visible:text-zinc-100 rounded-lg relative focus-visible:outline-none focus-visible:bg-white/20",
        active ? " text-zinc-100" : "hover:text-zinc-200 text-zinc-400"
      )}
    >
      {active && (
        <motion.div
          layout
          layoutId="active-nav-item"
          className="absolute h-[2px] w-[90%] bg-zinc-200 top-full rounded-full"
          transition={{ type: "spring", duration: 0.6 }}
        />
      )}
      <Icon className="size-5" />
      <div className="text-sm">{children}</div>
    </Link>
  );
};
