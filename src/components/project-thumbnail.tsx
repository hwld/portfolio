/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { TbX } from "@react-icons/all-files/tb/TbX";

type Props = { src: string | undefined; interactive?: boolean };

export const ProjectThumbnail: React.FC<Props> = ({ src, interactive }) => {
  return (
    <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg outline-1 outline-border outline-solid">
      {src ? (
        <img
          loading="lazy"
          alt="screenshot"
          className={clsx(
            "size-full transition-transform",
            interactive && "group-hover:scale-105"
          )}
          src={src}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <TbX size="80%" strokeWidth={0.5} />
        </div>
      )}
    </div>
  );
};
