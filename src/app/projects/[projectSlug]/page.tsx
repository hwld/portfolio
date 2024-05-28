import { getProjectMarkdown, getProjectMarkdownSlugs } from "./lib";
import { AvatarIcon } from "@/components/avatar-icon";
import { ProjectDetailMarkdown } from "@/components/project-detail-markdown";
import { projects } from "@/data/projects";
import { ProjectThumbnail } from "@/components/project-thumbnail";

type Params = { projectSlug: string };

export const generateStaticParams = async (): Promise<Params[]> => {
  const projectMarkdownSlugs = getProjectMarkdownSlugs();

  return projects.map((project) => {
    if (!projectMarkdownSlugs.includes(project.slug)) {
      throw new Error(`${project.slug}.mdが存在しません。`);
    }
    return { projectSlug: project.slug };
  });
};

type Props = { params: Params };
const ProjectDetailPage: React.FC<Props> = ({ params }) => {
  const project = projects.find((p) => p.slug === params.projectSlug);
  if (!project) {
    throw new Error(`プロジェクトが存在しません: ${params.projectSlug}`);
  }
  const markdown = getProjectMarkdown(params.projectSlug);

  return (
    <div className="max-w-[700px] space-y-6 text-base text-zxinc-300 font-light">
      <AvatarIcon />
      <div className="max-w-[700px] space-y-4">
        <ProjectThumbnail src={project.imageSrc} />
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <div className="text-sm text-zinc-400">{project.summary}</div>
      </div>
      <div>
        <ProjectDetailMarkdown>{markdown}</ProjectDetailMarkdown>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
