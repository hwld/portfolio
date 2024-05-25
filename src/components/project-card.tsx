import { Project } from "@/data/projects";
import Link from "next/link";
import { ProjectThumbnail } from "./project-thumbnail";

type Props = { project: Project };
export const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <Link
      className="w-full md:w-[280px] border border-zinc-700 bg-black/20 rounded-lg shrink-0 p-3 flex flex-col gap-2 overflow-hidden transition-colors group relative"
      href="/"
    >
      <ProjectThumbnail src={project.imageSrc} interactive />

      <div className="space-y-1 p-2">
        <div className="text-base font-medium">{project.title}</div>
        <div>{project.summary}</div>
      </div>
      <div className="absolute inset-0 group-hover:bg-zinc-500/20 transition-colors" />
    </Link>
  );
};
