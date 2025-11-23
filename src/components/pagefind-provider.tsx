"use client";
import { defaultPagefind, loadPagefind, type Pagefind } from "@/lib/pagefind";
import {
  createContext,
  useState,
  type PropsWithChildren,
  useEffect,
  useContext,
} from "react";

const PagefindContext = createContext<Pagefind | undefined>(undefined);

export const PagefindProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [pagefind, setPagefind] = useState<Pagefind>(defaultPagefind);

  useEffect(() => {
    (async () => {
      const pagefind = await loadPagefind("/pagefind/pagefind.js");
      setPagefind(pagefind);
    })();
  }, []);

  return (
    <PagefindContext.Provider value={pagefind}>
      {children}
    </PagefindContext.Provider>
  );
};

export const usePagefind = () => {
  const ctx = useContext(PagefindContext);
  if (!ctx) {
    throw new Error("PagefindProviderが存在しません");
  }
  return ctx;
};
