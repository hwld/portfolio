import React, { ComponentPropsWithoutRef, ReactNode } from "react";

export const LinkIcon: React.VFC<
  {
    children: ReactNode;
    className?: string;
  } & ComponentPropsWithoutRef<"a">
> = ({ children, className, ...props }) => {
  return (
    <a
      className={`w-[38px] h-[38px] opacity-60 hover:opacity-100 active:opacity-80 duration-150 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
