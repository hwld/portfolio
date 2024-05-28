import { FeaturedProjectCard } from "./featured-project-card/card";
import { Separator } from "./separator";
import { featuredProjects } from "@/data/projects";
import React from "react";
import Link from "next/link";
import { Heading } from "./heading";

export const FeaturedProjectList: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <Heading subTitle="projects">作ったもの</Heading>
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
          className="w-fit underline underline-offset-4 hover:text-zinc-50 transition-colors"
        >
          もっと見る
        </Link>
      </div>
    </div>
  );
};
