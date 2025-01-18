import { ArticleItem } from "@/components/article-item";
import { SummaryLayout } from "@/components/layout/summary-layout";
import { articleInfos } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "blog - hwld",
};

export default function BlogPage() {
  return (
    <SummaryLayout width="narrow" pageSubTitle="blog" pageTitle="ブログ">
      <div className="grid w-full grid-cols-1 gap-4">
        {[...articleInfos]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((p) => {
            return <ArticleItem key={p.slug} article={p} />;
          })}
      </div>
    </SummaryLayout>
  );
}
