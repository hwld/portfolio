"use client";
import { useMediaQuery } from "@mantine/hooks";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { AnimatePresence, motion } from "framer-motion";
import { SearchBoxTrigger } from "../search/search-box";
import { SearchButtonLink } from "../search/search-button";
import { Routes } from "@/routes";

export const Navbar: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 700px)");

  if (isMobile === undefined) {
    return;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className={"fixed bottom-6 left-1/2 flex gap-2"}
        key={String(isMobile)}
        initial={{ opacity: 0, y: 10, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 10, x: "-50%" }}
      >
        {isMobile ? (
          <>
            <MobileNavbar />
            <SearchButtonLink href={Routes.search()} />
          </>
        ) : (
          <>
            <DesktopNavbar />
            <SearchBoxTrigger />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
