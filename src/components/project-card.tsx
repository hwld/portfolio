import { ReactNode } from "react";
import { TbExternalLink } from "react-icons/tb";

type Props = { title: string; desc: ReactNode; tags: string[] };

export const ProjectCard: React.FC<Props> = ({ title, desc, tags }) => {
  return (
    <div className="flex gap-4">
      <div className="w-[200px] h-[120px] bg-zinc-500 rounded" />
      <div className="flex flex-col gap-4">
        <a
          href="/"
          target="_blank"
          className="font-medium flex gap-1 items-center underline underline-offset-4"
        >
          {title}
          <TbExternalLink size={16} />
        </a>
        <div className="text-zinc-300 font-light text-sm">{desc}</div>
        <div className="text-xs font-light">{tags.join(", ")}</div>
      </div>
    </div>
  );
};
