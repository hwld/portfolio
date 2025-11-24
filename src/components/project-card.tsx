import Link from "next/link";
import { ProjectThumbnail } from "./project-thumbnail";
import { TbCode } from "react-icons/tb";
import { ProjectInfo } from "./content/type";

type Props = { project: ProjectInfo };

export const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <Link
      className="group relative flex shrink-0 flex-col justify-between gap-2 overflow-hidden rounded-lg border border-border p-3 shadow-sm transition-colors"
      href={`/projects/${project.slug}`}
    >
      <div className="space-y-2">
        <ProjectThumbnail src={project.imageSrc} interactive />
        <div className="space-y-1 p-2">
          <div className="text-base font-bold">{project.title}</div>
          <div>{project.summary}</div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-foreground-muted">
        <TbCode size={16} />
        {`${project.createdAt.getFullYear()}年${
          project.createdAt.getMonth() + 1
        }月`}
      </div>
      <div className="absolute inset-0 transition-colors group-hover:bg-white/10" />
    </Link>
  );
};
