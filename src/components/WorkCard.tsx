import { WorkData } from "../utils";

export const WorkCard: React.VFC<{
  work: WorkData;
}> = ({ work: { name, imgUrl, githubUrl, siteUrl } }) => {
  return (
    <div className="">
      <img className="rounded-md hover:animate-pulse" src={imgUrl}></img>
      <h2 className="text-2xl font-bold m1-1 ml-2 text-center">{name}</h2>
    </div>
  );
};
