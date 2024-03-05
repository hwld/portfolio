import { ProjectCard } from "@/components/project-card";
import Image from "next/image";
import { IconType } from "react-icons";
import { TbBrandGithub, TbBrandTwitter } from "react-icons/tb";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 font-medium">
      <div className="max-w-[700px] px-6 m-auto py-16">
        <Image src="avatar.png" height={80} width={80} alt="avatar" />

        <div className="mt-8 flex items-center gap-4">
          hwld
          <div className="flex gap-2">
            <ProfileIconLink
              icon={TbBrandTwitter}
              href="https://twitter.com/016User"
            />
            <ProfileIconLink
              icon={TbBrandGithub}
              href="https://github.com/hwld"
            />
          </div>
        </div>
        <div className="text-zinc-300 mt-2 font-light">
          Webフロントエンド・バックエンド・UIデザイン、ソフトウェアアーキテクチャなど、Webアプリケーション開発に関連する様々な分野に興味があります。
          <br />
          TypeScriptが好きで、Webフロントエンド・バックエンドで使用しています。
        </div>

        <div className="mt-10">
          <div className="text-xs text-zinc-400 font-light">projects</div>
          <div>作ったもの</div>
          <div className="mt-6 flex flex-col gap-16 sm:gap-6">
            <ProjectCard
              projectSrc="https://aluep-rx7ks4nz3a-an.a.run.app/"
              iamgeSrc="aluep.png"
              title="Aluep"
              desc={
                <>
                  アプリ開発のお題を投稿・検索できるWebアプリケション。
                  <br />
                  そこそこの規模のWebアプリケーションの開発がしたくて作った。
                </>
              }
              tags={["TypeScript", "Next.js", "Prisma", "NextAuth", "Mantine"]}
            />
            <ProjectCard
              projectSrc="https://evodo-openapi.pages.dev/"
              iamgeSrc="evodo-openapi.png"
              title="evodo-openapi"
              desc={
                <>
                  シンプルなTodoリスト。
                  <br />
                  honoとOpenAPIを試してみたくて作った。
                </>
              }
              tags={[
                "TypeScript",
                "React",
                "hono",
                "Prisma",
                "lucia",
                "shadcn-ui",
              ]}
            />
            <ProjectCard
              projectSrc="https://zero-one-ui.web.app/"
              iamgeSrc="zero-one-ui.png"
              title="zero-one-ui"
              desc={
                <>
                  様々なUIを作るプロジェクト
                  <br />
                  UIを作る練習のために作った。
                </>
              }
              tags={["TypeScript", "React", "tailwindcss"]}
            />
            <a
              href="https://github.com/hwld?tab=repositories"
              target="_blank"
              className="ml-2 w-fit text-sm font-light underline underline-offset-8 text-zinc-300 hover:text-zinc-100 transition-colors"
            >
              もっと見る
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

const ProfileIconLink: React.FC<{ icon: IconType; href: string }> = ({
  icon: Icon,
  href,
}) => {
  return (
    <a
      className="size-[24px] grid place-items-center border border-zinc-500 rounded text-zinc-300 transition-colors hover:bg-white/15"
      href={href}
      target="_blank"
      aria-label="profile-link"
    >
      <Icon size={16} />
    </a>
  );
};
