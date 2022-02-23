import { ReactNode } from "react";
import { WorkData } from "../utils";
import { WorkCard } from "./WorkCard";

export const WorkContainer: React.VFC<{
  title: ReactNode;
  works: WorkData[];
  className?: string;
}> = ({ className, title, works }) => {
  return (
    <div className={`${className}`}>
      <h2 className="text-2xl max-md:text-lg font-bold w-full border-b border-stone-400 pb-3 max-md:pb-2">
        {title}
      </h2>
      <div
        className={`mt-3 grid gap-7 max-md:grid-cols-1 grid-cols-[repeat(auto-fill,minmax(min(350px,100vw),1fr))]`}
      >
        {works.map((work, i) => {
          return <WorkCard key={i} work={work} />;
        })}
      </div>
    </div>
  );
};
