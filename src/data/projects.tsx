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
        作るものが思いつかない人のための、アプリ開発のお題を投稿・検索できるWebアプリ。
        <br />
        そこそこの規模のWebアプリケーションの開発がしたくて作った。
        <br />
        Cloud
        Runを使っているのだが、コールドスタートのため初回起動に十数秒かかってしまう。
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
        テーブル形式で表示されたTodoリストのWebアプリ。
        <br />
        型安全なAPIアクセスに興味があり、OpenAPIを試してみたくて作った。
        <br />
        フロントとバックでドメインが異なっており、ブラウザによってはログイン状態が維持されない。
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
        Reactで様々なUIを作るためのプロジェクト。
        <br />
        非同期通信のシミュレーションのため、mswを使ってローカルにダミーのAPIサーバーを立てている。
        <br />
        `/`キーで表示されるメニューのUIがお気に入り。
      </>
    ),
    imageSrc: "zero-one-ui.png",
    projectSrc: "https://zero-one-ui.web.app/",
    tagLabels: ["TypeScript", "React", "tailwindcss"],
  },
];
