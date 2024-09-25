"use client";
import { useMediaQuery } from "@mantine/hooks";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";

type Props = {};

export const Navbar: React.FC<Props> = () => {
  const isMobile = useMediaQuery("(max-width: 700px)");

  if (isMobile) {
    return <MobileNavbar />;
  } else {
    return <DesktopNavbar />;
  }
};
