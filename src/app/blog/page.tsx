import { BlogPostInfo } from "@/components/content/type";
import { SummaryLayout } from "@/components/layout/summary-layout";
import { TextLink } from "@/components/link";
import { blogPostInfos } from "@/lib/content";
import { Routes } from "@/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "blog - hwld",
};

export default function BlogPage() {
  return (
    <SummaryLayout width="narrow" pageSubTitle="blog" pageTitle="ブログ">
      <div className="grid w-full grid-cols-1 gap-4">
        {[...blogPostInfos]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((p) => {
            return <PostItem key={p.slug} post={p} />;
          })}
      </div>
    </SummaryLayout>
  );
}

const PostItem: React.FC<{ post: BlogPostInfo }> = ({ post }) => {
  return (
    <div
      key={post.title}
      className="grid grid-rows-[auto_1fr] md:grid-rows-1 grid-cols-1 md:grid-cols-[auto_1fr] gap-0 md:gap-4 items-start"
    >
      <div className="flex items-center text-center text-foreground-muted tabular-nums leading-6">
        {post.createdAt.getFullYear()}・
        <div className="w-[2ch] tabular-nums">
          {post.createdAt.getMonth() + 1}
        </div>
        ・<div className="w-[2ch] tabular-nums">{post.createdAt.getDate()}</div>
      </div>
      <TextLink href={Routes.blogDetail(post.slug)}>{post.title}</TextLink>
    </div>
  );
};
