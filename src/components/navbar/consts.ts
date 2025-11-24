import { Routes } from "@/routes";
import { IconType } from "react-icons/lib";
import {
  TbBrandGithub,
  TbBrandX,
  TbSearch,
  TbStack2,
  TbStack2Filled,
  TbHome,
  TbHomeFilled,
  TbBallpen,
  TbBallpenFilled,
} from "react-icons/tb";

export type PageLink = {
  path: string;
  title: string;
  icon: IconType;
  activeIcon: IconType;
};

export const navbarPageLinks: PageLink[] = [
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
    icon: TbBallpen as IconType,
    activeIcon: TbBallpenFilled as IconType,
  },
];

export const allPageLinks: PageLink[] = [
  ...navbarPageLinks,
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
    href: "https://github.com/hwld",
  },
];
