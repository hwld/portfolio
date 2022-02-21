import { HTMLProps } from "react";

export const NavItem: React.VFC<HTMLProps<HTMLAnchorElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <a
      className={`relative group text-lg font-bold text-stone-800 ${className}`}
      {...props}
    >
      {children}
      <div
        className={`absolute w-0 group-hover:w-full duration-300 h-[5px] bg-yellow-500 bottom-[1px]`}
      ></div>
    </a>
  );
};
