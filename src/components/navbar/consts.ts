import { IconType } from "@react-icons/all-files";
import { TbBrandGithub } from "@react-icons/all-files/tb/TbBrandGithub";
import { TbBrandX } from "@react-icons/all-files/tb/TbBrandX";

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
