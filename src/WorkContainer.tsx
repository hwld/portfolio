import { ReactNode } from "react";

export const WorkContainer: React.VFC<{
  title: ReactNode;
  children: ReactNode;
  className?: string;
}> = ({ children, className, title }) => {
  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold w-full border-b pb-3">{title}</h2>
      <div
        className={`mt-3 grid gap-7 grid-cols-1  sm:grid-cols-[repeat(auto-fill,minmax(min(350px,100vw),1fr))]`}
      >
        {children}
      </div>
    </div>
  );
};
