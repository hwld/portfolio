import { TbHash } from "react-icons/tb";
import { FeaturedProjectCard } from "./featured-project-card/card";
import { Separator } from "./separator";
import { featuredProjects } from "@/data/projects";
import React from "react";
import Link from "next/link";

export const FeaturedProjectList: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 id="projects">
        <div className="text-zinc-400 text-xs">projects</div>
        <a className="flex items-center gap-1 text-lg" href="#projects">
          <TbHash className="text-lg mt-[1px]" />
          作ったもの
        </a>
      </h2>
      <div className="flex flex-col gap-8 sm:gap-4 ">
        {featuredProjects.map((p, i) => {
          return (
            <React.Fragment key={p.title}>
              <FeaturedProjectCard project={p} />
              {i < featuredProjects.length - 1 && <Separator />}
            </React.Fragment>
          );
        })}
        <Link
          href="/projects"
          className="w-fit underline underline-offset-8 hover:text-zinc-50 transition-colors"
        >
          もっと見る
        </Link>
      </div>
    </div>
  );
};
