import { Project } from "@/data/projects";
import Link from "next/link";
import { ProjectThumbnail } from "./project-thumbnail";
import { TbCode } from "@react-icons/all-files/tb/TbCode";

type Props = { project: Project };
export const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <Link
      className="border border-border rounded-lg shrink-0 p-3 flex flex-col overflow-hidden transition-colors group relative justify-between gap-2 shadow"
      href={`/projects/${project.slug}`}
    >
      <div className="space-y-2">
        <ProjectThumbnail src={project.imageSrc} interactive />
        <div className="space-y-1 p-2">
          <div className="text-base font-bold">{project.title}</div>
          <div>{project.summary}</div>
        </div>
      </div>
      <div className="text-xs flex gap-1 text-foreground-muted items-center">
        <TbCode size={16} />
        {`${project.createdAt.getFullYear()}年${
          project.createdAt.getMonth() + 1
        }月`}
      </div>
      <div className="absolute inset-0 group-hover:bg-white/10 transition-colors" />
    </Link>
  );
};
