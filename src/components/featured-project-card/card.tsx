import { FeaturedProjectTagCard } from "./tag-card";
import { ProjectThumbnail } from "../project-thumbnail";
import Link from "next/link";
import { TextLink } from "../link";
import { Routes } from "@/routes";
import { ProjectInfo } from "../content/type";

type Props = {
  project: ProjectInfo;
};

export const FeaturedProjectCard: React.FC<Props> = ({
  project: { title, detailedDesc, tags, imageSrc, slug },
}) => {
  return (
    <div className="gap-4 grid sm:grid-cols-[250px_1fr]">
      <Link href={`/projects/${slug}`} className="group">
        <ProjectThumbnail src={imageSrc} interactive />
      </Link>
      <div className="flex flex-col gap-4 justify-between">
        <div className="flex flex-col gap-4">
          <TextLink href={Routes.project(slug)} className="text-lg">
            {title}
          </TextLink>
          <div className="whitespace-pre-wrap">{detailedDesc}</div>
        </div>
        <div className="text-xs flex gap-1 items-center flex-wrap">
          {tags.map((tag) => {
            return <FeaturedProjectTagCard tag={tag} key={tag} />;
          })}
        </div>
      </div>
    </div>
  );
};
