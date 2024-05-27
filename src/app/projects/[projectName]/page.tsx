import ReactMarkdown from "react-markdown";
import { getProjectMarkdown, getProjectNames } from "./lib";
import { AvatarIcon } from "@/components/avatar-icon";

type Params = { projectName: string };

export const generateStaticParams = async (): Promise<Params[]> => {
  const projectNames = getProjectNames();
  return projectNames.map((projectName) => ({ projectName }));
};

type Props = { params: Params };
const ProjectDetailPage: React.FC<Props> = ({ params }) => {
  const markdown = getProjectMarkdown(params.projectName);
  return (
    <div className="space-y-6">
      <AvatarIcon />
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default ProjectDetailPage;
