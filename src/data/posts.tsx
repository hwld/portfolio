export type Post = {
  title: string;
  /**
   * /postsディレクトリにあるマークダウンのファイルの名前
   */
  slug: string;
  createdAt: Date;
};

export const posts: Post[] = [
  {
    title: "初めての投稿",
    slug: "first-post",
    createdAt: new Date("2024/9/27"),
  },
];
