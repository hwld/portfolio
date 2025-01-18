import { articleInfos } from "@/lib/content";
import { Heading } from "./heading";
import { TextLink } from "./link";
import { Routes } from "@/routes";
import { ArticleItem } from "./article-item";

export const LatestArticleList: React.FC = () => {
  const articles = [...articleInfos]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <Heading subTitle="blog">最新の投稿</Heading>
      <div className="flex flex-col gap-3">
        {articles.map((article) => {
          return <ArticleItem key={article.slug} article={article} />;
        })}
      </div>
      <TextLink size="sm" href={Routes.blog()}>
        もっと見る
      </TextLink>
    </div>
  );
};
