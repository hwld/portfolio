import { FeaturedProjectCard } from "./featured-project-card/card";
import { Separator } from "./separator";
import React from "react";
import { Heading } from "./heading";
import { TextLink } from "./link";
import { Routes } from "@/routes";
import { projectInfos } from "@/lib/content";

export const FeaturedProjectList: React.FC = () => {
  const featuredProjectInfos = projectInfos
    .filter((i) => i.type === "featured")
    .sort((a, b) => a.featuredOrder - b.featuredOrder);

  return (
    <div className="flex flex-col gap-6">
      <Heading subTitle="projects">お気に入りのプロジェクト</Heading>
      <div className="flex flex-col gap-8 sm:gap-6 ">
        {featuredProjectInfos.map((p, i) => {
          return (
            <React.Fragment key={p.title}>
              <FeaturedProjectCard project={p} />
              {i < featuredProjectInfos.length - 1 && <Separator />}
            </React.Fragment>
          );
        })}
        <TextLink href={Routes.projects()} size="sm">
          もっと見る
        </TextLink>
      </div>
    </div>
  );
};
