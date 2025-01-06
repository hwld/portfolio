"use client";
import { createContext, ReactNode, useContext } from "react";
import { BlogPostInfo, ProjectInfo } from "./type";

type ContentInfosContext = {
  projectInfos: ProjectInfo[];
  blogPostInfos: BlogPostInfo[];
};

const ContentInfosContext = createContext<ContentInfosContext | undefined>(
  undefined
);

export const useContentInfo = (): ContentInfosContext => {
  const ctx = useContext(ContentInfosContext);
  if (!ctx) {
    throw new Error("ContentInfosContextProviderが存在しません");
  }
  return ctx;
};

export const ContentInfosContextProvider: React.FC<{
  children: ReactNode;
  value: ContentInfosContext;
}> = ({ children, value }) => {
  return (
    <ContentInfosContext.Provider value={value}>
      {children}
    </ContentInfosContext.Provider>
  );
};
