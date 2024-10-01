import { AvatarIcon } from "@/components/avatar-icon";
import { MarkdownViewer } from "@/components/markdown-viewer/markdown-viewer";
import { projects } from "@/data/projects";
import { ProjectThumbnail } from "@/components/project-thumbnail";
import { type IconType } from "@react-icons/all-files/lib";
import { TbBrandGithub } from "@react-icons/all-files/tb/TbBrandGithub";
import { TbCode } from "@react-icons/all-files/tb/TbCode";
import { TbLink } from "@react-icons/all-files/tb/TbLink";

import { Metadata } from "next";
import Link from "next/link";
import { getMarkdown, getMarkdownSlugs } from "@/lib/markdown";

type Params = { projectSlug: string };

export const generateStaticParams = async (): Promise<Params[]> => {
  const projectMarkdownSlugs = getMarkdownSlugs("projects");

  return projects.map((project) => {
    if (!projectMarkdownSlugs.includes(project.slug)) {
      throw new Error(`${project.slug}.mdが存在しません。`);
    }
    return { projectSlug: project.slug };
  });
};

type PageProps = { params: Params };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.projectSlug);
  if (!project) {
    throw new Error("プロジェクトが存在しない");
  }

  return {
    title: `${project.title} - hwld`,
  };
}

const ProjectDetailPage: React.FC<PageProps> = ({ params }) => {
  const project = projects.find((p) => p.slug === params.projectSlug);
  if (!project) {
    throw new Error(`プロジェクトが存在しません: ${params.projectSlug}`);
  }
  const markdown = getMarkdown("projects", params.projectSlug);

  return (
    <div className="max-w-[700px] space-y-6 text-base text-zxinc-300 font-light">
      <Link href="/" className="w-fit">
        <AvatarIcon />
      </Link>
      <div className="space-y-4">
        <ProjectThumbnail src={project.imageSrc} />
        <div>
          <div className="text-sm text-zinc-400 flex gap-1 items-center">
            <TbCode size={18} />
            {`${project.createdAt.getFullYear()}年${
              project.createdAt.getMonth() + 1
            }月〜`}
          </div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
        <div className="flex gap-2">
          {project.projectUrl && (
            <IconLink icon={TbLink} href={project.projectUrl} />
          )}
          {project.githubUrl && (
            <IconLink icon={TbBrandGithub} href={project.githubUrl} />
          )}
        </div>
        <div className="text-sm text-zinc-400">{project.summary}</div>
      </div>
      <MarkdownViewer>{markdown}</MarkdownViewer>
    </div>
  );
};

export default ProjectDetailPage;

const IconLink: React.FC<{ icon: IconType; href: string }> = ({
  href,
  icon: Icon,
}) => {
  return (
    <a
      target="_blank"
      href={href}
      className="size-7 grid place-items-center border border-zinc-500 rounded transition-colors hover:bg-zinc-700"
    >
      <Icon size={18} />
    </a>
  );
};
