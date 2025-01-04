"use client";
import { useMediaQuery } from "@mantine/hooks";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { AnimatePresence, motion } from "framer-motion";
import { SearchBoxTrigger } from "../search/search-box";
import { Routes } from "@/routes";
import { MobileTocButton } from "../markdown-viewer/mobile-toc-button";
import { NavbarButtonLink } from "./button";
import { TbSearch } from "@react-icons/all-files/tb/TbSearch";

export const Navbar: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isMobileTocVisible = useMediaQuery("(max-width: 1200px)") ?? false;

  // 準備中は何も表示しない
  if (isMobile === undefined) {
    return;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className={"fixed bottom-4 left-[50vw] select-none"}
        initial={{ opacity: 0, y: 10, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
      >
        {isMobile ? (
          <div className="grid grid-cols-[min-content,1fr,min-content] gap-1">
            <MobileTocButton />
            <MobileNavbar />
            <NavbarButtonLink
              icon={TbSearch}
              label="ページ検索ボタン"
              href={Routes.search()}
            />
          </div>
        ) : (
          <div className="gap-2 grid-cols-[min-content,1fr,min-content] grid">
            {isMobileTocVisible ? <MobileTocButton /> : null}
            <DesktopNavbar />
            <SearchBoxTrigger />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
