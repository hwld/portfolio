import { FeaturedProjectCard } from "./featured-project-card/card";
import { Separator } from "./separator";
import { featuredProjects } from "@/data/projects";
import React from "react";
import { Heading } from "./heading";
import { TextLink } from "./link";

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
        <TextLink href="/projects" size="sm">
          もっと見る
        </TextLink>
      </div>
    </div>
  );
};
