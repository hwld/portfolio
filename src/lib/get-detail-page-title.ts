import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import type { IconType } from "@react-icons/all-files";
import { TbSquareRotatedFilled } from "@react-icons/all-files/tb/TbSquareRotatedFilled";
import { TbFileFilled } from "@react-icons/all-files/tb/TbFileFilled";
import type Link from "next/link";
import type { ComponentProps } from "react";

type Routes = ComponentProps<typeof Link>["href"];

type Title = { icon: IconType; label: string };

export const getDetailPageTitle = (path: string): Title | undefined => {
  const projectSlug = path.split(`${"/projects" satisfies Routes}/`)[1];
  const project = projects.find((p) => p.slug === projectSlug);
  if (project) {
    return { icon: TbSquareRotatedFilled, label: project.title };
  }

  const postSlug = path.split(`${"/blog" satisfies Routes}/`)[1];
  const post = posts.find((p) => p.slug === postSlug);
  if (post) {
    return { icon: TbFileFilled, label: post.title };
  }

  return undefined;
};
