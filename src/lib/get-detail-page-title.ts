import { projects } from "@/data/projects";
import type Link from "next/link";
import type { ComponentProps } from "react";

type Routes = ComponentProps<typeof Link>["href"];

export const getProjectDetailPageTitle = (path: string): string | undefined => {
  const projectsPath: Routes = "/projects";

  if (!path.startsWith(`${projectsPath}/`)) {
    return undefined;
  }

  const slug = path.split(`${projectsPath}/`)[1];
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return undefined;
  }

  return project.title;
};
