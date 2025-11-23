import { TbExternalLink } from "@react-icons/all-files/tb/TbExternalLink";
import { ProjectTag, projectTagLinkMap } from "../content/type";

export const FeaturedProjectTagCard: React.FC<{
  tag: ProjectTag;
}> = ({ tag }) => {
  return (
    <a
      className="group flex h-6 items-center gap-1 rounded-sm border border-border-strong px-2 pb-0.5 text-nowrap transition-colors hover:bg-background-hover hover:text-foreground-strong"
      target="_blank"
      href={projectTagLinkMap.get(tag)}
    >
      <span className="mt-px">{tag}</span>
      <TbExternalLink
        size={14}
        className="text-foreground-muted transition-colors group-hover:text-foreground-strong"
      />
    </a>
  );
};
