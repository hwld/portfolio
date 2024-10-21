"use client";
import {
  defaultPagefind,
  type Pagefind,
  type PagefindSearchAllResult,
  type RawPagefind,
} from "@/lib/pagefind";
import { removeHtmlExtension } from "@/lib/utils";
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
      const rawPagefined: RawPagefind = await import(
        // @ts-ignore
        /* webpackIgnore: true */ "/pagefind/pagefind.js"
      );

      const pagefind: Pagefind = {
        ...rawPagefined,
        debouncedSearchAll: async (...args) => {
          const rawResults = await rawPagefined.debouncedSearch(...args);
          if (!rawResults) {
            return null;
          }

          const results = await Promise.all(
            rawResults.results.map(
              async (r): Promise<PagefindSearchAllResult> => {
                const data = await r.data();

                return {
                  ...r,
                  ...data,
                  sub_results: data.sub_results.map((sub) => {
                    return { ...sub, url: removeHtmlExtension(sub.url) };
                  }),
                  url: removeHtmlExtension(data.url),
                };
              }
            )
          );

          return results;
        },
      };

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
