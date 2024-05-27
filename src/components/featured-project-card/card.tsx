import { FeaturedProjectTagCard } from "./tag-card";
import { FeaturedProject } from "@/data/projects";
import { ProjectThumbnail } from "../project-thumbnail";
import { ExternalLink } from "../external-link";

type Props = {
  project: FeaturedProject;
};

export const FeaturedProjectCard: React.FC<Props> = ({
  project: { title, desc, tagLabels, imageSrc, projectSrc },
}) => {
  return (
    <div className="gap-4 grid sm:grid-cols-[250px_1fr]">
      <ProjectThumbnail src={imageSrc} />
      <div className="flex flex-col gap-4 justify-between">
        <div className="flex flex-col gap-4">
          <ExternalLink href={projectSrc}>{title}</ExternalLink>
          <div>{desc}</div>
        </div>
        <div className="text-xs flex gap-1 items-center flex-wrap">
          {tagLabels.map((label) => {
            return <FeaturedProjectTagCard tagLabel={label} key={label} />;
          })}
        </div>
      </div>
    </div>
  );
};
