import { ProjectTagLabel, tagLinkMap } from "@/data/projectTags";
import { TbExternalLink } from "react-icons/tb";

export const FeaturedProjectTagCard: React.FC<{
  tagLabel: ProjectTagLabel;
}> = ({ tagLabel }) => {
  return (
    <a
      className="px-2 pb-[2px] h-[24px] border border-zinc-500 rounded flex gap-1 items-center transition-colors hover:bg-white/10 text-nowrap hover:text-zinc-100"
      target="_blank"
      href={tagLinkMap.get(tagLabel)}
    >
      {tagLabel}
      <TbExternalLink size={14} className="text-zinc-400" />
    </a>
  );
};
