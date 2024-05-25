import { PageData } from "@/app/pages";
import clsx from "clsx";
import Link from "next/link";
import { ComponentProps, forwardRef } from "react";

type Props = {
  page: PageData;
  children: string;
  active?: boolean;
  onPointerEnter?: ComponentProps<"a">["onPointerEnter"];
};

export const NavbarItem = forwardRef<HTMLAnchorElement, Props>(
  function NavbarItem({ page, children, active = false, onPointerEnter }, ref) {
    const Icon = page.icon;
    return (
      <Link
        ref={ref}
        href={page.url}
        onPointerEnter={onPointerEnter}
        className={clsx(
          "flex gap-1 text-right transition-colors items-center w-full h-full justify-center px-3 focus-visible:text-zinc-100 rounded-lg relative focus-visible:outline-none focus-visible:bg-white/20",
          active ? " text-zinc-100" : "hover:text-zinc-200 text-zinc-400"
        )}
      >
        <Icon className="size-5" />
        <div>{children}</div>
      </Link>
    );
  }
);
