import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavbarPageData, navbarPages } from "@/app/pages";
import { TbBrandX } from "@react-icons/all-files/tb/TbBrandX";
import { TbBrandGithub } from "@react-icons/all-files/tb/TbBrandGithub";
import clsx from "clsx";
import Link from "next/link";
import { forwardRef } from "react";
import { tv } from "tailwind-variants";
import { IconType } from "@react-icons/all-files";
import { navbarBaseClass } from "./navbar";

type HoverCardInfo = {
  targetPath: string | undefined;
  style: {
    x: number;
    y: number;
    height: number | string;
    width: number;
  };
};

export const DesktopNavbar: React.FC = () => {
  const currentUrl = usePathname();
  const pathNodeMapRef = useRef<Map<string, HTMLAnchorElement>>();
  const getPathNodeMap = () => {
    if (!pathNodeMapRef.current) {
      pathNodeMapRef.current = new Map<string, HTMLAnchorElement>();
    }
    return pathNodeMapRef.current;
  };

  const pathName = usePathname();

  const [hoverCardInfo, setHoverCardInfo] = useState<HoverCardInfo>();

  const handlePointerEnterItem = (
    e: React.PointerEvent,
    targetPath?: string
  ) => {
    if (!barRef.current || e.pointerType !== "mouse") {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const barRect = barRef.current.getBoundingClientRect();
    setHoverCardInfo({
      targetPath,
      style: {
        x: rect.x - barRect.x,
        y: rect.y - barRect.y,
        width: rect.width,
        height: rect.height,
      },
    });
  };

  const handleMouseLeaveBar = () => {
    const map = getPathNodeMap();
    const rect = map.get(pathName)?.getBoundingClientRect();
    const barRect = barRef.current?.getBoundingClientRect();
    if (!rect || !barRect) {
      setHoverCardInfo(undefined);
      return;
    }

    setHoverCardInfo({
      targetPath: pathName,
      style: {
        x: rect.x - barRect.x,
        y: rect.y - barRect.y,
        width: rect.width,
        height: rect.height,
      },
    });
  };

  const setNavbarItemRef = (
    node: HTMLAnchorElement | null,
    page: NavbarPageData
  ) => {
    const map = getPathNodeMap();
    if (node) {
      map.set(page.url, node);
    } else {
      map.delete(page.url);
    }
  };

  useEffect(() => {
    const map = getPathNodeMap();
    const node = map.get(pathName);
    if (node && barRef.current) {
      const barRect = barRef.current.getBoundingClientRect();
      const rect = node.getBoundingClientRect();

      setHoverCardInfo({
        targetPath: pathName,
        style: {
          x: rect.x - barRect.x,
          y: rect.y - barRect.y,
          width: rect.width,
          height: rect.height,
        },
      });
    } else {
      setHoverCardInfo(undefined);
    }
  }, [pathName]);

  const barRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        ref={barRef}
        className={clsx(navbarBaseClass, "p-1 flex items-center gap-[2px]")}
        onMouseLeave={handleMouseLeaveBar}
      >
        <AnimatePresence>
          {hoverCardInfo && (
            <motion.div
              className="absolute bg-zinc-100 rounded-full pointer-events-none size-10 top-0 left-0"
              transition={{ type: "spring", duration: 0.55 }}
              initial={{ ...hoverCardInfo.style, opacity: 0 }}
              animate={{ ...hoverCardInfo.style, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            />
          )}
        </AnimatePresence>
        {navbarPages.map((page) => {
          return (
            <NavbarItem
              ref={(node) => setNavbarItemRef(node, page)}
              key={page.title}
              page={page}
              active={page.url === currentUrl}
              hoverCardInfo={hoverCardInfo}
              onPointerEnter={handlePointerEnterItem}
            >
              {page.title}
            </NavbarItem>
          );
        })}
        <div className="h-2/3 bg-zinc-500 w-[1px] mx-1" />
        <div className="flex gap-1">
          <NavbarSocialLinkItem
            uniquePath="x-lintk"
            label="Xへのリンク"
            icon={TbBrandX}
            href="https://x.com/016User"
            hoverCardInfo={hoverCardInfo}
            onPointerEnter={handlePointerEnterItem}
          />
          <NavbarSocialLinkItem
            uniquePath="github-link"
            label="GitHubへのリンク"
            icon={TbBrandGithub}
            href="https://github.com/hwld"
            hoverCardInfo={hoverCardInfo}
            onPointerEnter={handlePointerEnterItem}
          />
        </div>
      </div>
    </>
  );
};

const navbarItem = tv({
  slots: {
    page: "flex gap-1 items-center w-full h-full justify-center pl-3 pr-4",
    social: "size-8 grid place-items-center rounded-full shrink-0",
  },
  variants: {
    isHovering: { true: "", false: "" },
  },
  compoundSlots: [
    {
      slots: ["page", "social"],
      className: "transition-colors duration-200 relative rounded-full",
    },
    {
      slots: ["page", "social"],
      isHovering: true,
      className: "text-zinc-900",
    },
  ],
});

type NavbarItemProps = {
  page: NavbarPageData;
  children: string;
  active?: boolean;
  hoverCardInfo?: HoverCardInfo;
  onPointerEnter?: (event: React.PointerEvent, targetPath?: string) => void;
};

export const NavbarItem = forwardRef<HTMLAnchorElement, NavbarItemProps>(
  function NavbarItem(
    { page, children, active = false, hoverCardInfo, onPointerEnter },
    ref
  ) {
    const Icon = active ? page.activeIcon : page.icon;
    const isHovering = hoverCardInfo?.targetPath === page.url;

    const handlePointerEnter = (e: React.PointerEvent) => {
      onPointerEnter?.(e, page.url);
    };

    return (
      <Link
        ref={ref}
        href={page.url}
        onPointerEnter={handlePointerEnter}
        className={navbarItem({ isHovering }).page()}
      >
        <Icon className="size-5" />
        <div className="leading-none pb-[3px]">{children}</div>
      </Link>
    );
  }
);

type NavbarSocialLinkItemProps = {
  uniquePath: string;
  icon: IconType;
  href: string;
  onPointerEnter: (event: React.PointerEvent, targetPath?: string) => void;
  label: string;
  hoverCardInfo?: HoverCardInfo;
};

export const NavbarSocialLinkItem: React.FC<NavbarSocialLinkItemProps> = ({
  uniquePath,
  label,
  href,
  icon: Icon,
  onPointerEnter,
  hoverCardInfo,
}) => {
  const isHovering = hoverCardInfo?.targetPath === uniquePath;

  const handlePointerEnter = (e: React.PointerEvent) => {
    onPointerEnter(e, uniquePath);
  };

  return (
    <a
      aria-label={label}
      target="_blank"
      href={href}
      className={navbarItem({ isHovering }).social()}
      onPointerEnter={handlePointerEnter}
    >
      <Icon className="size-5" />
    </a>
  );
};
