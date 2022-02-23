import { ComponentPropsWithoutRef } from "react";

export const Link: React.VFC<ComponentPropsWithoutRef<"a">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <a
      className={`underline text-blue-600 hover:text-blue-500 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
