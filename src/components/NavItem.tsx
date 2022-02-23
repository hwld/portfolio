import { ComponentPropsWithoutRef } from "react";

export const NavItem: React.VFC<ComponentPropsWithoutRef<"a">> = ({
  className,
  children,
  ...props
}) => {
  return (
    <a
      className={`relative group text-md font-bold text-stone-300 hover:text-stone-100 ${className}`}
      {...props}
    >
      {children}
      <div
        className={`absolute w-0 group-hover:w-full duration-300 h-[8px] bg-yellow-500 bottom-[-3px]`}
      ></div>
    </a>
  );
};
