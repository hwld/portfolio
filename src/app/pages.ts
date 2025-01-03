import { TbHome } from "@react-icons/all-files/tb/TbHome";
import { TbHomeFilled } from "@react-icons/all-files/tb/TbHomeFilled";
import { TbStack2 } from "@react-icons/all-files/tb/TbStack2";
import { TbStack2Filled } from "@react-icons/all-files/tb/TbStack2Filled";
import { TbWriting } from "@react-icons/all-files/tb/TbWriting";
import { type IconType } from "@react-icons/all-files/lib";
import { TbWritingFilled } from "@/components/writing-filled-icon";
import { TbSearch } from "@react-icons/all-files/tb/TbSearch";
import { Routes } from "@/routes";

type Page = {
  // TODO: urlじゃなくてpathとかにする
  url: string;
  title: string;
  icon: IconType;
  activeIcon: IconType;
};

export const navbarPages = [
  {
    url: Routes.home(),
    title: "home",
    icon: TbHome as IconType,
    activeIcon: TbHomeFilled as IconType,
  },
  {
    url: Routes.projects(),
    title: "projects",
    icon: TbStack2 as IconType,
    activeIcon: TbStack2Filled as IconType,
  },
  {
    url: Routes.blog(),
    title: "blog",
    icon: TbWriting as IconType,
    activeIcon: TbWritingFilled as IconType,
  },
] as const satisfies Page[];

export type NavbarPageData = (typeof navbarPages)[number];

export const pages = [
  ...navbarPages,
  {
    url: Routes.search(),
    title: "search",
    icon: TbSearch as IconType,
    activeIcon: TbSearch as IconType,
  },
] as const satisfies Page[];
