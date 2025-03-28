import { Routes } from "@/routes";
import { ArticleInfo } from "./content/type";
import { TextLink } from "./link";
import { ExternalLink } from "./external-link";

export const ArticleItem: React.FC<{ article: ArticleInfo }> = ({
  article,
}) => {
  return (
    <div
      key={article.title}
      className="grid grid-rows-[auto_1fr] md:grid-rows-1 grid-cols-1 md:grid-cols-[auto_1fr] gap-0 md:gap-4 items-start"
    >
      <div className="flex items-center text-center text-foreground-muted tabular-nums leading-6">
        {article.createdAt.getFullYear()}・
        <div className="w-[2ch] tabular-nums">
          {article.createdAt.getMonth() + 1}
        </div>
        ・
        <div className="w-[2ch] tabular-nums">
          {article.createdAt.getDate()}
        </div>
      </div>
      {article.isExternal ? (
        <ExternalLink href={article.url}>{article.title}</ExternalLink>
      ) : (
        <TextLink href={Routes.blogDetail(article.slug)}>
          {article.title}
        </TextLink>
      )}
    </div>
  );
};
