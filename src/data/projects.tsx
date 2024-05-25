import { ReactNode } from "react";
import { ProjectTagLabel } from "./projectTags";

export type Project = {
  title: string;
  tagLabels: ProjectTagLabel[];
  imageSrc: string | undefined;
  summary: string;
};

export type FeaturedProject = Project & {
  desc: ReactNode;
  projectSrc: string;
};

export const projects = [
  {
    title: "aluep",
    summary:
      "Next.jsを使ってフロントエンド、バックエンドもTypeScriptを使って作ったアプリ開発のお題を投稿・検索できるWebアプリ",
    imageSrc: "aluep.png",
    tagLabels: ["TypeScript", "Next.js", "Prisma", "NextAuth", "Mantine"],
  },
  {
    title: "evodo-openapi",
    summary:
      "フロントとバックエンドが分離されている状態で、APIアクセスを型安全にするためのOpenAPIを試したくて作ったTodoリストアプリ",
    imageSrc: "evodo-openapi.png",
    tagLabels: ["TypeScript", "React", "hono", "Prisma", "lucia", "shadcn-ui"],
  },
  {
    title: "zero-one-ui",
    summary:
      "Reactを使って、パーツレベルから画面全体のレイアウトまで、さまざまなUIを作るためのプロジェクト",
    imageSrc: "zero-one-ui.png",
    tagLabels: ["TypeScript", "React", "tailwindcss"],
  },
] as const satisfies Project[];

export const featuredProjects = projects
  .map((project): FeaturedProject | false => {
    switch (project.title) {
      case "aluep": {
        return {
          ...project,
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
          projectSrc: "https://aluep-rx7ks4nz3a-an.a.run.app/",
        };
      }
      case "evodo-openapi": {
        return {
          ...project,
          desc: (
            <>
              テーブル形式で表示されたTodoリストのWebアプリ。
              <br />
              型安全なAPIアクセスに興味があり、OpenAPIを試してみたくて作った。
              <br />
              フロントとバックでドメインが異なっており、ブラウザによってはログイン状態が維持されない。
            </>
          ),
          projectSrc: "https://evodo-openapi.pages.dev/",
        };
      }
      case "zero-one-ui": {
        return {
          ...project,
          desc: (
            <>
              Reactで様々なUIを作るためのプロジェクト。
              <br />
              非同期通信のシミュレーションのため、mswを使ってローカルにダミーのAPIサーバーを立てている。
              <br />
              `/`キーで表示されるメニューのUIがお気に入り。
            </>
          ),
          projectSrc: "https://zero-one-ui.web.app/",
        };
      }
      default: {
        return false;
      }
    }
  })
  .filter((project): project is FeaturedProject => Boolean(project));
