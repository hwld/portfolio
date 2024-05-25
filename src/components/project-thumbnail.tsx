/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { TbX } from "react-icons/tb";

type Props = { src: string | undefined; interactive?: boolean };

export const ProjectThumbnail: React.FC<Props> = ({ src, interactive }) => {
  return (
    <div className="w-full aspect-[16/9] overflow-hidden outline outline-1 outline-zinc-700 relative rounded-lg shrink-0 ">
      {src ? (
        <img
          alt="screenshot"
          className={clsx(
            "size-full bg-zinc-800 transition-transform",
            interactive && "group-hover:scale-105"
          )}
          src={src}
        />
      ) : (
        <div className="inset-0 absolute grid place-items-center">
          <TbX size="80%" strokeWidth={0.5} />
        </div>
      )}
    </div>
  );
};
