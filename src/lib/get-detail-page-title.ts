import type { IconType } from "@react-icons/all-files";
import { TbSquareRotatedFilled } from "@react-icons/all-files/tb/TbSquareRotatedFilled";
import { TbFileFilled } from "@react-icons/all-files/tb/TbFileFilled";
import type Link from "next/link";
import type { ComponentProps } from "react";
import { ArticleInfo, ProjectInfo } from "@/components/content/type";

type Routes = ComponentProps<typeof Link>["href"];

type Title = { icon: IconType; label: string };

type Params = {
  path: string;
  projectInfos: ProjectInfo[];
  articleInfos: ArticleInfo[];
};

export const getDetailPageTitle = ({
  path,
  projectInfos,
  articleInfos,
}: Params): Title | undefined => {
  const projectSlug = path.split(`${"/projects" satisfies Routes}/`)[1];
  const project = projectInfos.find((p) => p.slug === projectSlug);
  if (project) {
    return { icon: TbSquareRotatedFilled, label: project.title };
  }

  const articleSlug = path.split(`${"/blog" satisfies Routes}/`)[1];
  const article = articleInfos.find((p) => p.slug === articleSlug);
  if (article) {
    return { icon: TbFileFilled, label: article.title };
  }

  return undefined;
};
