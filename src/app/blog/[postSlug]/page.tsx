import { blogPostInfos, getContent, getContentSlugs } from "@/lib/content";
import type { Metadata } from "next";
import { TbClock } from "@react-icons/all-files/tb/TbClock";
import { MarkdownViewerWithToc } from "@/components/markdown-viewer/with-toc";
import { DetailLayout } from "@/components/layout/detail-layout";
import { appUrl } from "@/routes";

type Params = { postSlug: string };

export const generateStaticParams = async (): Promise<Params[]> => {
  return getContentSlugs("blog").map((postSlug) => ({ postSlug }));
};

type PageProps = { params: Params };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = blogPostInfos.find((info) => info.slug === params.postSlug);
  if (!post) {
    throw new Error(`投稿が存在しない: ${params.postSlug}`);
  }

  const title = `${post.title} - hwld`;
  return {
    metadataBase: new URL(appUrl),
    title,
    openGraph: {
      type: "article",
      title,
      images: [`/images/ogp/${post.slug}.png`],
    },
  };
}

const PostDetailPage: React.FC<PageProps> = async ({ params }) => {
  const post = blogPostInfos.find((p) => p.slug === params.postSlug);
  if (!post) {
    throw new Error(`ポストが存在しません: ${params.postSlug}`);
  }

  const markdown = getContent("blog", params.postSlug);

  return (
    <DetailLayout>
      <div className="flex flex-col gap-2">
        <div className="text-foreground-muted flex text-sm items-center gap-1">
          <TbClock className="size-4" />
          {`${post.createdAt.getFullYear()}年 ${
            post.createdAt.getMonth() + 1
          }月 ${post.createdAt.getDate()}日`}
        </div>
        <h1 className="text-3xl font-bold text-foreground-strong">
          {post.title}
        </h1>
      </div>
      <MarkdownViewerWithToc markdown={markdown} />
    </DetailLayout>
  );
};

export default PostDetailPage;
