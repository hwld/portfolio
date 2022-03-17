import { FaGithub, FaLink } from "react-icons/fa";
import { WorkData } from "../utils";
import { LinkIcon } from "./LinkIcon";

export const WorkCard: React.VFC<{
  work: WorkData;
}> = ({ work: { name, imgUrl, githubUrl, siteUrl, desc } }) => {
  const handleClick = ({ currentTarget, target }: React.MouseEvent) => {
    if (currentTarget === target) {
    }
  };

  return (
    <div className="bg-stone-700 rounded-md overflow-hidden shadow-2xl">
      <div className="relative group overflow-hidden cursor-pointer">
        <img
          className="rounded-t-md border-b border-gray-400 group-hover:scale-105 group-hover:grayscale-[50%] duration-150"
          src={imgUrl}
        ></img>
        <div
          className="absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-100 duration-150 bg-[rgba(0,0,0,.55)]"
          onClick={handleClick}
        >
          <div className="absolute bottom-2 right-2 flex">
            {githubUrl && (
              <LinkIcon href={githubUrl} target="blank">
                <FaGithub size={"100%"} />
              </LinkIcon>
            )}
            {siteUrl && (
              <LinkIcon href={siteUrl} target="blank" className="ml-2">
                <FaLink size={"100%"} />
              </LinkIcon>
            )}
          </div>
        </div>
      </div>
      <div className="grow p-5 max-md:p-3 w-full whitespace-nowrap">
        <h3 className="text-xl max-md:text-lg font-bold overflow-hidden">
          {name}
        </h3>
        <p className="text-stone-300 ml-3 overflow-hidden max-md:text-sm">
          {desc}
        </p>
      </div>
    </div>
  );
};
