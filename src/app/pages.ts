import { TbHome } from "@react-icons/all-files/tb/TbHome";
import { TbStack2 } from "@react-icons/all-files/tb/TbStack2";
import { type IconType } from "@react-icons/all-files/lib";

export const pages = [
  { url: "/", title: "home", icon: TbHome },
  { url: "/projects", title: "projects", icon: TbStack2 },
] as const satisfies { url: string; title: string; icon: IconType }[];

export type PageData = (typeof pages)[number];
