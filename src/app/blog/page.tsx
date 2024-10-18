import { AvatarIconLink } from "@/components/avatar-icon";
import { TextLink } from "@/components/link";
import { posts, type Post } from "@/data/posts";
import { TbHash } from "@react-icons/all-files/tb/TbHash";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "blog - hwld",
};

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <AvatarIconLink />
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="space-y-1">
            <div className="text-zinc-400 text-xs">blog</div>
            <div className="flex items-center gap-1 text-xl font-bold">
              <TbHash className="text-lg mt-[1px]" />
              ブログ
            </div>
          </h1>
        </div>
        <div className="grid w-full grid-cols-1 gap-4">
          {[...posts]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((p) => {
              return <PostItem key={p.slug} post={p} />;
            })}
        </div>
      </div>
    </div>
  );
}

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div
      key={post.title}
      className="grid grid-rows-[auto_1fr] md:grid-rows-1 grid-cols-1 md:grid-cols-[auto_1fr] gap-0 md:gap-4 items-start"
    >
      <div className="flex items-center text-center text-zinc-400 tabular-nums leading-6">
        {post.createdAt.getFullYear()}・
        <div className="w-[2ch] tabular-nums">
          {post.createdAt.getMonth() + 1}
        </div>
        ・<div className="w-[2ch] tabular-nums">{post.createdAt.getDate()}</div>
      </div>
      <TextLink href={`/blog/${post.slug}`}>{post.title}</TextLink>
    </div>
  );
};
