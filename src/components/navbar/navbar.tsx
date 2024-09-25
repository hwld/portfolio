"use client";
import { useMediaQuery } from "@mantine/hooks";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { AnimatePresence, motion } from "framer-motion";

type Props = {};

export const Navbar: React.FC<Props> = () => {
  const isMobile = useMediaQuery("(max-width: 700px)");
  console.log(isMobile);

  if (isMobile === undefined) {
    return;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className={"fixed bottom-6 left-1/2"}
        key={String(isMobile)}
        initial={{ opacity: 0, y: 10, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 10, x: "-50%" }}
      >
        {isMobile ? <MobileNavbar /> : <DesktopNavbar />}
      </motion.div>
    </AnimatePresence>
  );
};
