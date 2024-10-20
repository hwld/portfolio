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
    title: "マークアップのスタイルを確認",
    slug: "test-style",
    createdAt: new Date("1970/1/1"),
  },
  {
    title: "初めての投稿",
    slug: "first-post",
    createdAt: new Date("2024/9/27"),
  },
  {
    title: "良いコードは変更容易性が9割",
    slug: "modifiability-is-the-silver-bullet",
    createdAt: new Date("2024/10/1"),
  },
  {
    title: "RDBのB-treeインデックスの気持ちに寄り添う",
    slug: "b-tree-index-kanzenni-rikai-shita",
    createdAt: new Date("2024/10/16"),
  },
];
