import { FeaturedProjectTagCard } from "./tag-card";
import { ProjectThumbnail } from "../project-thumbnail";
import Link from "next/link";
import { TextLink } from "../link";
import { Routes } from "@/routes";
import { FeaturedProjectInfo } from "../content/type";

type Props = {
  project: FeaturedProjectInfo;
};

export const FeaturedProjectCard: React.FC<Props> = ({
  project: { title, featuredDesc, tags, imageSrc, slug },
}) => {
  return (
    <div className="grid grid-rows-1 gap-4 sm:grid-cols-[250px_1fr]">
      <Link href={`/projects/${slug}`} className="group">
        <ProjectThumbnail src={imageSrc} interactive />
      </Link>
      <div className="flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          <TextLink href={Routes.project(slug)} className="text-lg">
            {title}
          </TextLink>
          <div className="whitespace-pre-wrap">{featuredDesc}</div>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {tags.map((tag) => {
            return <FeaturedProjectTagCard tag={tag} key={tag} />;
          })}
        </div>
      </div>
    </div>
  );
};
