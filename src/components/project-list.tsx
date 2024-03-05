import { TbHash } from "react-icons/tb";
import { ProjectCard } from "./project-card/project-card";
import { Separator } from "./separator";
import { projects } from "@/data/projects";
import React from "react";

export const ProjectList: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 id="projects">
        <div className="text-sm text-zinc-400 font-light">projects</div>
        <a className="flex items-center gap-1 text-lg" href="#projects">
          <TbHash className="text-lg mt-[1px]" />
          作ったもの
        </a>
      </h2>
      <div className="flex flex-col gap-8 sm:gap-4 ">
        {projects.map((p, i) => {
          return (
            <React.Fragment key={p.title}>
              <ProjectCard project={p} />
              {i < projects.length - 1 && <Separator />}
            </React.Fragment>
          );
        })}
        <a
          href="https://github.com/hwld?tab=repositories"
          target="_blank"
          className="w-fit text-sm font-light underline underline-offset-8 text-zinc-300 hover:text-zinc-100 transition-colors"
        >
          もっと見る
        </a>
      </div>
    </div>
  );
};
