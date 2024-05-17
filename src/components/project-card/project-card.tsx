/* eslint-disable @next/next/no-img-element */
import { TbExternalLink } from "react-icons/tb";
import { ProjectTagCard } from "./project-tag-card";
import { Project } from "@/data/projects";

type Props = {
  project: Project;
};

export const ProjectCard: React.FC<Props> = ({
  project: { title, desc, tagLabels, imageSrc, projectSrc },
}) => {
  return (
    <div className="gap-4 grid sm:grid-cols-[200px_1fr]">
      <img
        alt="screenshot"
        className="w-full aspect-[16/9] bg-zinc-500 rounded shrink-0 object-contain outline outline-1 outline-zinc-700"
        src={imageSrc}
      />
      <div className="flex flex-col gap-4">
        <a
          href={projectSrc}
          target="_blank"
          className="font-medium flex gap-1 items-center underline underline-offset-4 transition-colors hover:text-zinc-400 w-fit"
        >
          {title}
          <TbExternalLink size={16} />
        </a>
        <div className="text-sm">{desc}</div>
        <div className="text-xs flex gap-1 items-center flex-wrap">
          {tagLabels.map((label) => {
            return <ProjectTagCard tagLabel={label} key={label} />;
          })}
        </div>
      </div>
    </div>
  );
};
