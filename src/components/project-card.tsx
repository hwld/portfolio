import { Project } from "@/data/projects";
import Link from "next/link";
import { ProjectThumbnail } from "./project-thumbnail";
import { TbCode } from "react-icons/tb";

type Props = { project: Project };
export const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <Link
      className="w-full md:w-[280px] border border-zinc-700 bg-black/20 rounded-lg shrink-0 p-3 flex flex-col overflow-hidden transition-colors group relative justify-between gap-2"
      href="/"
    >
      <div className="space-y-2">
        <ProjectThumbnail src={project.imageSrc} interactive />
        <div className="space-y-1 p-2">
          <div className="text-base font-medium">{project.title}</div>
          <div>{project.summary}</div>
        </div>
      </div>
      <div className="text-xs flex gap-1 text-zinc-400 items-center">
        <TbCode size={16} />{" "}
        {`${project.createdAt.getFullYear()}年${
          project.createdAt.getMonth() + 1
        }月`}
      </div>
      <div className="absolute inset-0 group-hover:bg-zinc-500/20 transition-colors" />
    </Link>
  );
};
