import { Routes } from "@/routes";
import { IconType } from "@react-icons/all-files";
import { TbBrandGithub } from "@react-icons/all-files/tb/TbBrandGithub";
import { TbBrandX } from "@react-icons/all-files/tb/TbBrandX";
import { TbSearch } from "@react-icons/all-files/tb/TbSearch";
import { TbStack2 } from "@react-icons/all-files/tb/TbStack2";
import { TbStack2Filled } from "@react-icons/all-files/tb/TbStack2Filled";
import { TbUser } from "@react-icons/all-files/tb/TbUser";
import { TbUserFilled } from "@react-icons/all-files/tb/TbUserFilled";
import { TbBallpen } from "@react-icons/all-files/tb/TbBallpen";
import { TbBallpenFilled } from "@react-icons/all-files/tb/TbBallpenFilled";

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
    icon: TbUser as IconType,
    activeIcon: TbUserFilled as IconType,
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
    href: "https://gtihub.com/hwld",
  },
];
