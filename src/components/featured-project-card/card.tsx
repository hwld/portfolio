import { FeaturedProjectTagCard } from "./tag-card";
import { FeaturedProject } from "@/data/projects";
import { ProjectThumbnail } from "../project-thumbnail";
import Link from "next/link";

type Props = {
  project: FeaturedProject;
};

export const FeaturedProjectCard: React.FC<Props> = ({
  project: { title, desc, tagLabels, imageSrc, slug },
}) => {
  return (
    <div className="gap-4 grid sm:grid-cols-[250px_1fr]">
      <Link href={`/projects/${slug}`} className="group">
        <ProjectThumbnail src={imageSrc} interactive />
      </Link>
      <div className="flex flex-col gap-4 justify-between">
        <div className="flex flex-col gap-4">
          <Link
            href={`/projects/${slug}`}
            className="text-base underline underline-offset-4"
          >
            {title}
          </Link>
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
