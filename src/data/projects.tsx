import { ReactNode } from "react";
import { ProjectTagLabel } from "./projectTags";

export type Project = {
  title: string;
  tagLabels: ProjectTagLabel[];
  imageSrc: string | undefined;
  summary: string;
  createdAt: Date;
};

export type FeaturedProject = Project & {
  desc: ReactNode;
  projectSrc: string;
};

export const projects = [
  {
    title: "aluep",
    summary:
      "Next.jsを使ってフロントエンド、バックエンドもTypeScriptを使って作ったアプリ開発のお題を投稿・検索できるWebアプリ。",
    imageSrc: "aluep.png",
    tagLabels: ["TypeScript", "Next.js", "Prisma", "NextAuth", "Mantine"],
    createdAt: new Date("2022/11/8"),
  },
  {
    title: "evodo-openapi",
    summary:
      "フロントとバックエンドが分離されている状態で、APIアクセスを型安全にするためのOpenAPIを試したくて作ったTodoリストアプリ。",
    imageSrc: "evodo-openapi.png",
    tagLabels: ["TypeScript", "React", "hono", "Prisma", "lucia", "shadcn-ui"],
    createdAt: new Date("2023/12/13"),
  },
  {
    title: "zero-one-ui",
    summary:
      "Reactを使って、パーツレベルから画面全体のレイアウトまで、さまざまなUIを作るためのプロジェクト。",
    imageSrc: "zero-one-ui.png",
    tagLabels: ["TypeScript", "React", "tailwindcss"],
    createdAt: new Date("2023/11/13"),
  },
  {
    title: "portfolio",
    summary: "このポートフォリオサイト。",
    imageSrc: undefined,
    tagLabels: [],
    createdAt: new Date("2024/3/5"),
  },
  {
    title: "UI Sandbox",
    summary:
      "Dribbbleにあるプロジェクトや実際のサービスのUIをトレースしたり、パーツを作るときに使っているFigmaファイル。",
    imageSrc: "ui-sandbox.png",
    tagLabels: [],
    createdAt: new Date("2023/10/4"),
  },
  {
    title: "evodo/axum",
    summary:
      "axumをつかったノードベースUIのTodoリスト。サブタスクやタスクのブロックなどを実装している。",
    imageSrc: "evodo-axum.png",
    tagLabels: [],
    createdAt: new Date("2024/1/16"),
  },
  {
    title: "evodo/graphql",
    summary: "GraphQLを使用したTodoリスト。",
    imageSrc: "evodo-graphql.png",
    tagLabels: [],
    createdAt: new Date("2023/10/14"),
  },
  {
    title: "zero-one-ui/calendar",
    summary:
      "カレンダー部分をフルスクラッチで書いたWebカレンダー。ドラッグ&ドロップによるイベント作成や移動など、様々な機能を実装している。",
    imageSrc: "zou-calendar.png",
    tagLabels: [],
    createdAt: new Date("2024/4/21"),
  },
  {
    title: "zeron-one-ui/audio-player",
    summary:
      "カスタムaudioを実装したブラウザで動くオーディオプレイヤー。ファイルのドラッグ&ドロップに対応している。",
    imageSrc: "zou-audio-player.png",
    tagLabels: [],
    createdAt: new Date("2024/4/15"),
  },
  {
    title: "zero-one-ui/github-projects",
    summary:
      "GitHub Projectsの見た目をできるだけそのままに作ったクローンアプリ。機能もそれなりに実装している。",
    imageSrc: "zou-github-projects.png",
    tagLabels: [],
    createdAt: new Date("2024/3/27"),
  },
  {
    title: "housing-loan-simulator",
    summary:
      "住宅ローンの料金を計算するWebアプリ。結果を画像として出力する機能も実装している。",
    imageSrc: "housing-loan-simulator.png",
    tagLabels: [],
    createdAt: new Date("2022/9/20"),
  },
  {
    title: "super-cuma",
    summary: "RemixとCakePHP4で顧客管理アプリを書き比べたもの。",
    imageSrc: "super-cuma.png",
    tagLabels: [],
    createdAt: new Date("2022/7/28"),
  },
  {
    title: "forester",
    summary: "Remixを使ったTwitterのクローンアプリ。",
    imageSrc: "forester.png",
    tagLabels: [],
    createdAt: new Date("2022/6/13"),
  },
  {
    title: "qflasher",
    summary: "素早く反復できることを目指したWebで動く単語帳。",
    imageSrc: "qflasher.png",
    tagLabels: [],
    createdAt: new Date("2021/9/1"),
  },
  {
    title: "mini-games",
    summary: "Reactで実装したいろんなミニゲーム。",
    imageSrc: "mini-games.png",
    tagLabels: [],
    createdAt: new Date("2022/1/20"),
  },
  {
    title: "50-react-projects",
    summary:
      "50ReactProjectsという存在するプロジェクトのうちいくつかを作ってみたもの。",
    imageSrc: "50-react-projects.png",
    tagLabels: [],
    createdAt: new Date("2020/8/15"),
  },
  {
    title: "actix-web-todo",
    summary:
      "バックエンドをRustで書いたTodoリスト。バックエンドはシンプルなCRUDだけで、結局ずっとフロントエンドを触っていた。",
    imageSrc: "actix-web-todo.png",
    tagLabels: [],
    createdAt: new Date("2021/5/6"),
  },
  {
    title: "countany",
    summary:
      "Next.jsを使用したカウンターを自由に作成できるWebアプリ。一定期間アクセスがないとDBが落ちてログインできなくなる。",
    imageSrc: "countany.png",
    tagLabels: [],
    createdAt: new Date("2020/10/24"),
  },
  {
    title: "react-notes",
    summary:
      "gweton-webをReactでリライトしたもの。Reactを初めて使ったWebアプリ。",
    imageSrc: "react-notes.png",
    tagLabels: [],
    createdAt: new Date("2020/2/20"),
  },
  {
    title: "gweton-web",
    summary:
      "シンプルなメモ帳で、初めて作ったWebアプリ。この頃はVue.jsを使用していた。",
    imageSrc: "gweton-web.png",
    tagLabels: [],
    createdAt: new Date("2019/10/22"),
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
