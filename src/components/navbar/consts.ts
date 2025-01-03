import { Routes } from "@/routes";
import { IconType } from "@react-icons/all-files";
import { TbBrandGithub } from "@react-icons/all-files/tb/TbBrandGithub";
import { TbBrandX } from "@react-icons/all-files/tb/TbBrandX";
import { TbHome } from "@react-icons/all-files/tb/TbHome";
import { TbHomeFilled } from "@react-icons/all-files/tb/TbHomeFilled";
import { TbSearch } from "@react-icons/all-files/tb/TbSearch";
import { TbStack2 } from "@react-icons/all-files/tb/TbStack2";
import { TbStack2Filled } from "@react-icons/all-files/tb/TbStack2Filled";
import { TbWriting } from "@react-icons/all-files/tb/TbWriting";
import { TbWritingFilled } from "../writing-filled-icon";

export type PageLink = {
  path: string;
  title: string;
  icon: IconType;
  activeIcon: IconType;
};

export const desktopNavbarPageLinks: PageLink[] = [
  {
    path: Routes.home(),
    title: "home",
    icon: TbHome as IconType,
    activeIcon: TbHomeFilled as IconType,
  },
  {
    path: Routes.projects(),
    title: "projects",
    icon: TbStack2 as IconType,
    activeIcon: TbStack2Filled as IconType,
  },
  {
    path: Routes.blog(),
    title: "blog",
    icon: TbWriting as IconType,
    activeIcon: TbWritingFilled as IconType,
  },
];

export const allPageLinks: PageLink[] = [
  ...desktopNavbarPageLinks,
  {
    path: Routes.search(),
    title: "search",
    icon: TbSearch as IconType,
    activeIcon: TbSearch as IconType,
  },
];

type SocialLink = {
  label: string;
  uniquePath: string;
  icon: IconType;
  href: string;
};

export const navbarSocialLinks: SocialLink[] = [
  {
    label: "Xへのリンク",
    uniquePath: "x-link",
    icon: TbBrandX,
    href: "https://x.com/016User",
  },
  {
    label: "GitHubへのリンク",
    uniquePath: "github-link",
    icon: TbBrandGithub,
    href: "https://gtihub.com/hwld",
  },
];
