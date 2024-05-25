/* eslint-disable @next/next/no-img-element */
import { AvatarIcon } from "@/components/avatar-icon";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";
import { TbHash } from "react-icons/tb";

const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <AvatarIcon />
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
            このページでは、これまでに作成した成果物の一覧を記録しています。
            <br />
            プロジェクトの概要や使用した技術、プロジェクトから学んだことなどを頑張って思い出し、各プロジェクトの詳細ページにまとめています。
          </div>
        </div>
        <div className="flex w-full gap-4 flex-wrap">
          {projects.map((project) => {
            return <ProjectCard key={project.title} project={project} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
