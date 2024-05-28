import { ReactNode } from "react";
import { ProjectTagLabel } from "./projectTags";

export type Project = {
  title: string;
  slug: string;
  tagLabels: ProjectTagLabel[];
  imageSrc: string | undefined;
  summary: string;
  createdAt: Date;
  projectUrl: string | undefined;
  githubUrl: string | undefined;
};

export type FeaturedProject = Project & {
  desc: ReactNode;
  projectSrc: string;
};

export const projects = [
  {
    title: "aluep",
    slug: "aluep",
    summary:
      "Next.jsを使ってフロントエンド、バックエンドもTypeScriptを使って作ったアプリ開発のお題を投稿・検索できるWebアプリ。",
    imageSrc: "/screenshots/aluep.png",
    tagLabels: ["TypeScript", "Next.js", "Prisma", "NextAuth", "Mantine"],
    createdAt: new Date("2022/11/8"),
    projectUrl: "https://aluep-rx7ks4nz3a-an.a.run.app/",
    githubUrl: "https://github.com/hwld/aluep",
  },
  {
    title: "evodo-openapi",
    slug: "evodo-openapi",
    summary:
      "フロントとバックエンドが分離されている状態で、APIアクセスを型安全にするためのOpenAPIを試したくて作ったTodoリストアプリ。",
    imageSrc: "/screenshots/evodo-openapi.png",
    tagLabels: ["TypeScript", "React", "hono", "Prisma", "lucia", "shadcn-ui"],
    createdAt: new Date("2023/12/13"),
    projectUrl: "https://evodo-openapi.pages.dev/",
    githubUrl: "https://github.com/hwld/evodo-openapi",
  },
  {
    title: "zero-one-ui",
    slug: "zero-one-ui",
    summary:
      "Reactを使って、パーツレベルから画面全体のレイアウトまで、さまざまなUIを作るためのプロジェクト。",
    imageSrc: "/screenshots/zero-one-ui.png",
    tagLabels: ["TypeScript", "React", "tailwindcss"],
    createdAt: new Date("2023/11/13"),
    projectUrl: "https://zero-one-ui.web.app",
    githubUrl: "https://github.com/hwld/zero-one-ui",
  },
  {
    title: "portfolio",
    slug: "portfolio",
    summary: "このポートフォリオサイト。",
    imageSrc: undefined,
    tagLabels: [],
    createdAt: new Date("2024/3/5"),
    projectUrl: "/",
    githubUrl: "https://github.com/hwld/portfolio",
  },
  {
    title: "UI Sandbox",
    slug: "ui-sandbox",
    summary:
      "Dribbbleにあるプロジェクトや実際のサービスのUIをトレースしたり、パーツを作るときに使っているFigmaファイル。",
    imageSrc: "/screenshots/ui-sandbox.png",
    tagLabels: [],
    createdAt: new Date("2023/10/4"),
    projectUrl:
      "https://www.figma.com/design/OnmTwPK30jTCahYH89EYqN/sandbox?node-id=0-1&t=NZI23PivAls6Qe7J-1",
    githubUrl: undefined,
  },
  {
    title: "evodo/axum",
    slug: "evodo-axum",
    summary:
      "axumをつかったノードベースUIのTodoリスト。サブタスクやタスクのブロックなどを実装している。",
    imageSrc: "/screenshots/evodo-axum.png",
    tagLabels: [],
    createdAt: new Date("2024/1/16"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/evodo-axum",
  },
  {
    title: "evodo/graphql",
    slug: "evodo-graphql",
    summary: "GraphQLを使用したTodoリスト。",
    imageSrc: "/screenshots/evodo-graphql.png",
    tagLabels: [],
    createdAt: new Date("2023/10/14"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/evodo-graphql",
  },
  {
    title: "zero-one-ui/calendar",
    slug: "zero-one-ui-calendar",
    summary:
      "カレンダー部分をフルスクラッチで書いたWebカレンダー。ドラッグ&ドロップによるイベント作成や移動など、様々な機能を実装している。",
    imageSrc: "/screenshots/zou-calendar.png",
    tagLabels: [],
    createdAt: new Date("2024/4/21"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/zero-one-ui/tree/main/src/app/calendar",
  },
  {
    title: "zeron-one-ui/audio-player",
    slug: "zero-one-ui-audio-player",
    summary:
      "カスタムaudioを実装したブラウザで動くオーディオプレイヤー。ファイルのドラッグ&ドロップに対応している。",
    imageSrc: "/screenshots/zou-audio-player.png",
    tagLabels: [],
    createdAt: new Date("2024/4/15"),
    projectUrl: undefined,
    githubUrl:
      "https://github.com/hwld/zero-one-ui/tree/main/src/app/audio-player",
  },
  {
    title: "zero-one-ui/github-projects",
    slug: "zero-one-ui-github-projects",
    summary:
      "GitHub Projectsの見た目をできるだけそのままに作ったクローンアプリ。機能もそれなりに実装している。",
    imageSrc: "/screenshots/zou-github-projects.png",
    tagLabels: [],
    createdAt: new Date("2024/3/27"),
    projectUrl: undefined,
    githubUrl:
      "https://github.com/hwld/zero-one-ui/tree/main/src/app/github-project",
  },
  {
    title: "housing-loan-simulator",
    slug: "housing-loan-simulator",
    summary:
      "住宅ローンの料金を計算するWebアプリ。結果を画像として出力する機能も実装している。",
    imageSrc: "/screenshots/housing-loan-simulator.png",
    tagLabels: [],
    createdAt: new Date("2022/9/20"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/housing-loan-simulator",
  },
  {
    title: "super-cuma",
    slug: "super-cuma",
    summary: "RemixとCakePHP4で顧客管理アプリを書き比べたもの。",
    imageSrc: "/screenshots/super-cuma.png",
    tagLabels: [],
    createdAt: new Date("2022/7/28"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/super-cuma-project",
  },
  {
    title: "forester",
    slug: "forester",
    summary: "Remixを使ったTwitterのクローンアプリ。",
    imageSrc: "/screenshots/forester.png",
    tagLabels: [],
    createdAt: new Date("2022/6/13"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/forester",
  },
  {
    title: "qflasher",
    slug: "qflasher",
    summary: "素早く反復できることを目指したWebで動く単語帳。",
    imageSrc: "/screenshots/qflasher.png",
    tagLabels: [],
    createdAt: new Date("2021/9/1"),
    projectUrl: "https://q-flasher.web.app/",
    githubUrl: "https://github.com/hwld/qflasher",
  },
  {
    title: "mini-games",
    slug: "mini-games",
    summary: "Reactで実装したいろんなミニゲーム。",
    imageSrc: "/screenshots/mini-games.png",
    tagLabels: [],
    createdAt: new Date("2022/1/20"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/mini-games",
  },
  {
    title: "50-react-projects",
    slug: "50-react-projects",
    summary:
      "50ReactProjectsという存在するプロジェクトのうちいくつかを作ってみたもの。",
    imageSrc: "/screenshots/50-react-projects.png",
    tagLabels: [],
    createdAt: new Date("2020/8/15"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/50ReactProjects",
  },
  {
    title: "actix-web-todo",
    slug: "actix-web-todo",
    summary:
      "バックエンドをRustで書いたTodoリスト。バックエンドはシンプルなCRUDだけで、結局ずっとフロントエンドを触っていた。",
    imageSrc: "/screenshots/actix-web-todo.png",
    tagLabels: [],
    createdAt: new Date("2021/5/6"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/actix-web-todo",
  },
  {
    title: "countany",
    slug: "countany",
    summary:
      "Next.jsを使用したカウンターを自由に作成できるWebアプリ。一定期間アクセスがないとDBが落ちてログインできなくなる。",
    imageSrc: "/screenshots/countany.png",
    tagLabels: [],
    createdAt: new Date("2020/10/24"),
    projectUrl: "https://countany.vercel.app/",
    githubUrl: "https://github.com/hwld/countany",
  },
  {
    title: "react-notes",
    slug: "react-notes",
    summary:
      "gweton-webをReactでリライトしたもの。Reactを初めて使ったWebアプリ。",
    imageSrc: "/screenshots/react-notes.png",
    tagLabels: [],
    createdAt: new Date("2020/2/20"),
    projectUrl: "https://react-s1te.web.app",
    githubUrl: "https://github.com/hwld/react-notes",
  },
  {
    title: "gweton-web",
    slug: "gweton-web",
    summary:
      "シンプルなメモ帳で、初めて作ったWebアプリ。この頃はVue.jsを使用していた。",
    imageSrc: "/screenshots/gweton-web.png",
    tagLabels: [],
    createdAt: new Date("2019/10/22"),
    projectUrl: undefined,
    githubUrl: "https://github.com/hwld/gweton-web",
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
