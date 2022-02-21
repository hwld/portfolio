import { DEPLOYED_WORKS, PROJECTS_WORKS } from "../utils";
import { WorkContainer } from "../WorkContainer";
import { Link } from "./Link";
import { WorkCard } from "./WorkCard";

export const Works: React.VFC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${className}`}>
      <h1 className="text-3xl font-bold mb-5" id="works">
        趣味で作ったもの
      </h1>
      <div className="ml-5">
        <WorkContainer title="デプロイ済み">
          {DEPLOYED_WORKS.map((work, i) => {
            return <WorkCard key={i} work={work} />;
          })}
        </WorkContainer>
        <WorkContainer
          title={
            <p>
              50ReactProjects (
              <Link href="https://50reactprojects.com/" target="blank">
                https://50reactprojects.com
              </Link>
              )
            </p>
          }
          className="mt-10"
        >
          {PROJECTS_WORKS.map((work, i) => {
            return <WorkCard key={i} work={work} />;
          })}
        </WorkContainer>
      </div>
    </div>
  );
};
