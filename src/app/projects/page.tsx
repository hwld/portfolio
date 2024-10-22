import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";
import { Metadata } from "next";
import { SummaryLayout } from "@/components/layout/summary-layout";

export const metadata: Metadata = {
  title: "projects - hwld",
};

const ProjectsPage: React.FC = () => {
  return (
    <SummaryLayout
      pageSubTitle="projects"
      pageTitle="作ったもの"
      pageDescription={
        <>
          このページでは、これまでに趣味で作ってきたものを記録しています。
          <br />
          プロジェクトの概要や使用した技術、プロジェクトから学んだことなどを各プロジェクトの詳細ページにまとめました。
        </>
      }
    >
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        {[...projects]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((project) => {
            return <ProjectCard key={project.title} project={project} />;
          })}
      </div>
    </SummaryLayout>
  );
};

export default ProjectsPage;
