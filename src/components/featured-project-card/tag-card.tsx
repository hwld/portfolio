import { ProjectTagLabel, tagLinkMap } from "@/data/projectTags";
import { TbExternalLink } from "@react-icons/all-files/tb/TbExternalLink";

export const FeaturedProjectTagCard: React.FC<{
  tagLabel: ProjectTagLabel;
}> = ({ tagLabel }) => {
  return (
    <a
      className="px-2 pb-[2px] h-[24px] border border-border-strong rounded flex gap-1 items-center transition-colors hover:bg-background-hover text-nowrap hover:text-foreground-strong group"
      target="_blank"
      href={tagLinkMap.get(tagLabel)}
    >
      <span className="mt-[1px]">{tagLabel}</span>
      <TbExternalLink
        size={14}
        className="text-foreground-muted group-hover:text-foreground-strong transition-colors"
      />
    </a>
  );
};
