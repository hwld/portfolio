import { articleInfos, getContent } from "@/lib/content";
import type { Metadata } from "next";
import { TbClock } from "@react-icons/all-files/tb/TbClock";
import { MarkdownViewerWithToc } from "@/components/markdown-viewer/with-toc";
import { DetailLayout } from "@/components/layout/detail-layout";
import { appUrl } from "@/routes";

type Params = { articleSlug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return articleInfos
    .filter((info) => !info.isExternal)
    .map(
      (info): Params => ({
        articleSlug: info.slug,
      })
    );
}

type PageProps = { params: Promise<Params> };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const article = articleInfos.find((info) => info.slug === params.articleSlug);
  if (!article) {
    throw new Error(`投稿が存在しない: ${params.articleSlug}`);
  }

  const title = `${article.title} - hwld`;
  return {
    metadataBase: new URL(appUrl),
    title,
    openGraph: {
      type: "article",
      title,
      images: [`/images/ogp/${article.slug}.png`],
    },
  };
}

const ArticleDetailPage: React.FC<PageProps> = async (props) => {
  const params = await props.params;
  const article = articleInfos.find((p) => p.slug === params.articleSlug);
  if (!article) {
    throw new Error(`ポストが存在しません: ${params.articleSlug}`);
  }

  const markdown = getContent("blog", params.articleSlug);

  return (
    <DetailLayout>
      <div className="flex flex-col gap-2">
        <div className="text-foreground-muted flex text-sm items-center gap-1">
          <TbClock className="size-4" />
          {`${article.createdAt.getFullYear()}年 ${
            article.createdAt.getMonth() + 1
          }月 ${article.createdAt.getDate()}日`}
        </div>
        <h1 className="text-3xl font-bold text-foreground-strong">
          {article.title}
        </h1>
      </div>
      <MarkdownViewerWithToc markdown={markdown} />
    </DetailLayout>
  );
};

export default ArticleDetailPage;
