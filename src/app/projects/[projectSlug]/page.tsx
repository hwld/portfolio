import { ProjectThumbnail } from "@/components/project-thumbnail";
import { type IconType } from "@react-icons/all-files/lib";
import { TbBrandGithub } from "@react-icons/all-files/tb/TbBrandGithub";
import { TbCode } from "@react-icons/all-files/tb/TbCode";
import { TbLink } from "@react-icons/all-files/tb/TbLink";
import { Metadata } from "next";
import { getContent, projectInfos } from "@/lib/content";
import { MarkdownViewerWithToc } from "@/components/markdown-viewer/with-toc";
import { DetailLayout } from "@/components/layout/detail-layout";

type Params = { projectSlug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return projectInfos.map((info): Params => ({ projectSlug: info.slug }));
}

type PageProps = { params: Promise<Params> };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const project = projectInfos.find((info) => info.slug === params.projectSlug);
  if (!project) {
    throw new Error(`プロジェクトが存在しない: ${params.projectSlug}`);
  }

  return {
    title: `${project.title} - hwld`,
  };
}

const ProjectDetailPage: React.FC<PageProps> = async (props) => {
  const params = await props.params;
  const project = projectInfos.find((p) => p.slug === params.projectSlug);
  if (!project) {
    throw new Error(`プロジェクトが存在しません: ${params.projectSlug}`);
  }
  const markdown = getContent("projects", params.projectSlug);

  return (
    <DetailLayout>
      <div className="flex flex-col gap-4">
        <ProjectThumbnail src={project.imageSrc} />
        <div>
          <div className="flex items-center gap-1 text-sm text-foreground-muted">
            <TbCode size={18} />
            {`${project.createdAt.getFullYear()}年${
              project.createdAt.getMonth() + 1
            }月〜`}
          </div>
          <h1 className="text-3xl font-bold text-foreground-strong">
            {project.title}
          </h1>
        </div>
        <div className="flex gap-2">
          {project.projectUrl && (
            <IconLink
              label="成果物へのリンク"
              icon={TbLink}
              href={project.projectUrl}
            />
          )}
          {project.githubUrl && (
            <IconLink
              label="GitHubへのリンク"
              icon={TbBrandGithub}
              href={project.githubUrl}
            />
          )}
        </div>
        <div className="text-sm text-foreground-muted">{project.summary}</div>
      </div>
      <MarkdownViewerWithToc markdown={markdown} />
    </DetailLayout>
  );
};

export default ProjectDetailPage;

const IconLink: React.FC<{ icon: IconType; href: string; label: string }> = ({
  href,
  icon: Icon,
  label,
}) => {
  return (
    <a
      target="_blank"
      aria-label={label}
      href={href}
      className="grid size-8 place-items-center rounded-sm border border-border-strong transition-colors hover:bg-background-hover hover:text-foreground-strong"
    >
      <Icon size={18} />
    </a>
  );
};
