import { IconType } from "react-icons";
import { TbHome, TbPhotoVideo, TbStack2 } from "react-icons/tb";

export const pages = [
  { url: "/", title: "home", icon: TbHome },
  { url: "/projects", title: "projects", icon: TbStack2 },
  { url: "/gallery", title: "gallery", icon: TbPhotoVideo },
] as const satisfies { url: string; title: string; icon: IconType }[];

export type PageData = (typeof pages)[number];
