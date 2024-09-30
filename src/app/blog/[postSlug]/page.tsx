import { AvatarIcon } from "@/components/avatar-icon";
import { MarkdownViewer } from "@/components/markdown-viewer/markdown-viewer";
import { posts } from "@/data/posts";
import { getMarkdown, getMarkdownSlugs } from "@/lib/markdown";
import type { Metadata } from "next";
import Link from "next/link";
import { TbClock } from "@react-icons/all-files/tb/TbClock";

type Params = { postSlug: string };

export const generateStaticParams = async (): Promise<Params[]> => {
  const postMarkdownSlugs = getMarkdownSlugs("posts");

  return posts.map((p) => {
    if (!postMarkdownSlugs.includes(p.slug)) {
      throw new Error(`${p.slug}.mdが存在しません`);
    }

    return { postSlug: p.slug };
  });
};

type PageProps = { params: Params };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.postSlug);
  if (!post) {
    throw new Error("投稿が存在しません");
  }

  return { title: `${post.title} - hwld` };
}

const PostDetailPage: React.FC<PageProps> = ({ params }) => {
  const post = posts.find((p) => p.slug === params.postSlug);
  if (!post) {
    throw new Error(`ポストが存在しません: ${params.postSlug}`);
  }
  const markdown = getMarkdown("posts", params.postSlug);

  return (
    <div className="max-w-[700px] space-y-6 text-base text-zxinc-300 font-light">
      <Link href="/" className="w-fit">
        <AvatarIcon />
      </Link>
      <div>
        <div className="text-zinc-400 flex text-sm items-center gap-1">
          <TbClock className="size-4" />
          {`${post.createdAt.getFullYear()}年 ${
            post.createdAt.getMonth() + 1
          }月 ${post.createdAt.getDate()}日`}
        </div>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <div>
        <MarkdownViewer>{markdown}</MarkdownViewer>
      </div>
    </div>
  );
};

export default PostDetailPage;
