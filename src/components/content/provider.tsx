"use client";
import { createContext, ReactNode, useContext } from "react";
import { ArticleInfo, ProjectInfo } from "./type";

type ContentInfosContext = {
  projectInfos: ProjectInfo[];
  articleInfos: ArticleInfo[];
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
