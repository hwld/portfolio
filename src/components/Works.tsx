import { DEPLOYED_WORKS, PROJECTS_WORKS } from "../utils";
import { Link } from "./Link";
import { WorkContainer } from "./WorkContainer";

export const Works: React.VFC<{ className?: string }> = ({ className }) => {
  return (
    <div>
      <h1
        className="text-3xl max-md:text-xl font-bold mb-5 max-md:mb-3"
        id="works"
      >
        趣味で作ったもの
      </h1>
      <div className="ml-5 max-md:ml-3">
        <WorkContainer title="デプロイ済み" works={DEPLOYED_WORKS} />
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
          works={PROJECTS_WORKS}
          className="mt-10"
        />
      </div>
    </div>
  );
};
