import { ReactNode } from "react";
import { ProjectTagLabel } from "./projectTags";

export type Project = {
  title: string;
  desc: ReactNode;
  tagLabels: ProjectTagLabel[];
  imageSrc: string;
  projectSrc: string;
};

export const projects: Project[] = [
  {
    title: "aluep",
    desc: (
      <>
        アプリ開発のお題を投稿・検索できるWebアプリケション。
        <br />
        そこそこの規模のWebアプリケーションの開発がしたくて作った。
      </>
    ),
    imageSrc: "aluep.png",
    projectSrc: "https://aluep-rx7ks4nz3a-an.a.run.app/",
    tagLabels: ["TypeScript", "Next.js", "Prisma", "NextAuth", "Mantine"],
  },
  {
    title: "evodo-openapi",
    desc: (
      <>
        シンプルなTodoリスト。
        <br />
        honoとOpenAPIを試してみたくて作った。
      </>
    ),
    imageSrc: "evodo-openapi.png",
    projectSrc: "https://evodo-openapi.pages.dev/",
    tagLabels: ["TypeScript", "React", "hono", "Prisma", "lucia", "shadcn-ui"],
  },
  {
    title: "zero-one-ui",
    desc: (
      <>
        様々なUIを作るプロジェクト
        <br />
        UIを作る練習のために作った。
      </>
    ),
    imageSrc: "zero-one-ui.png",
    projectSrc: "https://zero-one-ui.web.app/",
    tagLabels: ["TypeScript", "React", "tailwindcss"],
  },
];
