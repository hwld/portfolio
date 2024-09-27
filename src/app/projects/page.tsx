/* eslint-disable @next/next/no-img-element */
import { AvatarIcon } from "@/components/avatar-icon";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";
import { Metadata } from "next";
import Link from "next/link";
import { TbHash } from "@react-icons/all-files/tb/TbHash";

export const metadata: Metadata = {
  title: "projects - hwld",
};

const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Link href="/">
        <AvatarIcon />
      </Link>
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="space-y-1">
            <div className="text-zinc-400 text-xs">projects</div>
            <div className="flex items-center gap-1 text-xl font-bold">
              <TbHash className="text-lg mt-[1px]" />
              作ったもの
            </div>
          </h1>
          <div className="max-w-[700px] md:text-base">
            このページでは、これまでに趣味で作ってきたものを記録しています。
            <br />
            プロジェクトの概要や使用した技術、プロジェクトから学んだことなどを各プロジェクトの詳細ページにまとめました。
          </div>
        </div>
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {structuredClone(projects)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((project) => {
              return <ProjectCard key={project.title} project={project} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
