"use client";
import { NavbarItem } from "./item";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { pages } from "@/app/pages";

type Props = {};

export const Navbar: React.FC<Props> = () => {
  const currentUrl = usePathname();
  const [hoverCardStyle, setHoverCardStyle] = useState<{
    x: number;
    y: number;
    height: number | string;
    width: number;
  }>();

  const handleMouseEnterItem = (e: React.MouseEvent<Element>) => {
    if (!barRef.current) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setHoverCardStyle({
      x: rect.x - barRef.current.getBoundingClientRect().x,
      y: rect.y - barRef.current.getBoundingClientRect().y,
      width: rect.width,
      height: rect.height,
    });
  };

  const handleMouseLeaveBar = () => {
    setHoverCardStyle(undefined);
  };

  const barRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        ref={barRef}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 h-10 rounded-lg bg-zinc-800 border border-zinc-600 shadow-lg shadow-black p-1 flex items-center gap-[2px]"
        onMouseLeave={handleMouseLeaveBar}
      >
        {pages.map((page) => {
          return (
            <NavbarItem
              key={page.title}
              page={page}
              active={page.url === currentUrl}
              onMouseEnter={handleMouseEnterItem}
            >
              {page.title}
            </NavbarItem>
          );
        })}
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
      </div>
    </>
  );
};
