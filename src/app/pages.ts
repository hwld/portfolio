import { TbHome } from "@react-icons/all-files/tb/TbHome";
import { TbHomeFilled } from "@react-icons/all-files/tb/TbHomeFilled";
import { TbStack2 } from "@react-icons/all-files/tb/TbStack2";
import { TbStack2Filled } from "@react-icons/all-files/tb/TbStack2Filled";
import { TbWriting } from "@react-icons/all-files/tb/TbWriting";
import { type IconType } from "@react-icons/all-files/lib";
import { TbWritingFilled } from "@/components/writing-filled-icon";

export const pages = [
  {
    url: "/",
    title: "home",
    icon: TbHome as IconType,
    activeIcon: TbHomeFilled as IconType,
  },
  {
    url: "/projects",
    title: "projects",
    icon: TbStack2 as IconType,
    activeIcon: TbStack2Filled as IconType,
  },
  {
    url: "/articles",
    title: "articles",
    icon: TbWriting as IconType,
    activeIcon: TbWritingFilled as IconType,
  },
] as const satisfies {
  url: string;
  title: string;
  icon: IconType;
  activeIcon: IconType;
}[];

export type PageData = (typeof pages)[number];
