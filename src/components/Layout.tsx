import { ReactNode } from "react";

export const Layout: React.VFC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="p-3 bg-yellow-500">
      <div className="relative flex flex-col min-h-screen text-stone-200 rounded-tl-3xl rounded-b-3xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};
