/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import { TbExternalLink } from "react-icons/tb";

type Props = {
  title: string;
  desc: ReactNode;
  tags: string[];
  iamgeSrc: string;
  projectSrc: string;
};

export const ProjectCard: React.FC<Props> = ({
  title,
  desc,
  tags,
  iamgeSrc,
  projectSrc,
}) => {
  return (
    <div className="gap-4 grid sm:grid-cols-[200px_1fr]">
      <img
        alt="screenshot"
        className="w-full aspect-[16/9] bg-zinc-500 rounded shrink-0 object-contain outline outline-1 outline-zinc-700"
        src={iamgeSrc}
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
        <div className="text-zinc-300 font-light text-sm">{desc}</div>
        <div className="text-xs font-light">{tags.join(", ")}</div>
      </div>
    </div>
  );
};
