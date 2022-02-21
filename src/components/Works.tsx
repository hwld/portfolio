import { WORKS } from "../utils";
import { WorkCard } from "./WorkCard";

export const Works: React.VFC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${className}`}>
      <h1 className="text-3xl font-bold mb-5" id="works">
        趣味で作ったもの
      </h1>
      <div className="grid gap-7 mt-3 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {WORKS.map((work) => {
          return <WorkCard work={work} />;
        })}
      </div>
    </div>
  );
};
