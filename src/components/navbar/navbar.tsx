"use client";
import { NavbarItem } from "./item";
import { AnimatePresence, motion } from "framer-motion";
import { PointerEventHandler, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { PageData, pages } from "@/app/pages";
import { TbBrandGithub, TbBrandTwitter } from "react-icons/tb";
import { IconType } from "react-icons";

type Props = {};

export const Navbar: React.FC<Props> = () => {
  const currentUrl = usePathname();
  const pathNodeMapRef = useRef<Map<string, HTMLAnchorElement>>();
  const getPathNodeMap = () => {
    if (!pathNodeMapRef.current) {
      pathNodeMapRef.current = new Map<string, HTMLAnchorElement>();
    }
    return pathNodeMapRef.current;
  };

  const pathName = usePathname();

  const [hoverCardStyle, setHoverCardStyle] = useState<{
    x: number;
    y: number;
    height: number | string;
    width: number;
  }>();

  const handlePointerEnterItem = (e: React.PointerEvent) => {
    if (!barRef.current || e.pointerType !== "mouse") {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const barRect = barRef.current.getBoundingClientRect();
    setHoverCardStyle({
      x: rect.x - barRect.x,
      y: rect.y - barRect.y,
      width: rect.width,
      height: rect.height,
    });
  };

  const handleMouseLeaveBar = () => {
    setHoverCardStyle(undefined);
  };

  const setNavbarItemRef = (node: HTMLAnchorElement | null, page: PageData) => {
    const map = getPathNodeMap();
    if (node) {
      map.set(page.url, node);
    } else {
      map.delete(page.url);
    }
  };

  const [selectedItemStyle, setSelectedItemStyle] = useState<{
    x: number;
    width: number;
  }>();
  useEffect(() => {
    const map = getPathNodeMap();
    const node = map.get(pathName);
    if (node && barRef.current) {
      const barRect = barRef.current.getBoundingClientRect();
      const rect = node.getBoundingClientRect();

      setSelectedItemStyle({
        x: rect.x - barRect.x,
        width: rect.width,
      });
    } else {
      setSelectedItemStyle(undefined);
    }
  }, [pathName]);

  const barRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        ref={barRef}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 h-10 rounded-lg bg-zinc-800 outline-1 outline outline-zinc-600 p-1 shadow-lg shadow-black flex items-center gap-[2px]"
        onMouseLeave={handleMouseLeaveBar}
      >
        {pages.map((page) => {
          return (
            <NavbarItem
              ref={(node) => setNavbarItemRef(node, page)}
              key={page.title}
              page={page}
              active={page.url === currentUrl}
              onPointerEnter={handlePointerEnterItem}
            >
              {page.title}
            </NavbarItem>
          );
        })}
        <div className="ml-2 flex gap-1">
          <SocialLinkItem
            icon={TbBrandTwitter}
            href="https://x.com/016User"
            onPointerEnter={handlePointerEnterItem}
          />
          <SocialLinkItem
            icon={TbBrandGithub}
            href="https://github.com/hwld"
            onPointerEnter={handlePointerEnterItem}
          />
        </div>
        <AnimatePresence>
          {hoverCardStyle && (
            <motion.div
              className="absolute bg-white/20 rounded-lg pointer-events-none size-10 top-0 left-0 z-10"
              transition={{ type: "spring", duration: 0.55 }}
              initial={{ ...hoverCardStyle, opacity: 0 }}
              animate={{ ...hoverCardStyle, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            />
          )}
        </AnimatePresence>
        {selectedItemStyle && (
          <motion.div
            className="absolute h-[3px] pointer-events-none rounded-full flex justify-center left-0 top-full"
            initial={{ ...selectedItemStyle, opacity: 0, y: "-100%" }}
            animate={{ ...selectedItemStyle, opacity: 1, y: "-100%" }}
            transition={{ type: "spring", duration: 0.55 }}
          >
            <div className="w-[80%] h-[2px] bg-zinc-200 rounded-full" />
          </motion.div>
        )}
      </div>
    </>
  );
};

const SocialLinkItem: React.FC<{
  icon: IconType;
  href: string;
  onPointerEnter: PointerEventHandler;
}> = ({ icon: Icon, href, onPointerEnter }) => {
  return (
    <a
      target="_blank"
      href={href}
      className="size-8 grid place-items-center rounded-lg shrink-0 border border-zinc-600"
      onPointerEnter={onPointerEnter}
    >
      <Icon className="size-5" />
    </a>
  );
};
