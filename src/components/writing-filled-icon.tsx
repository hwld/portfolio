import type { IconType } from "@react-icons/all-files";
import { TbWriting } from "@react-icons/all-files/tb/TbWriting";
import clsx from "clsx";

export const TbWritingFilled: IconType = ({ className, ...props }) => {
  return (
    <TbWriting
      className={clsx("[&>path:first-child]:fill-current", className)}
      {...props}
    />
  );
};
