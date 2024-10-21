import { useCallback, useEffect, useRef, useState } from "react";
import { usePagefind } from "../pagefind-provider";
import type { PagefindSearchAllResult } from "@/lib/pagefind";

export const useSearchPage = ({
  defaultQuery,
  setQuery,
}: {
  defaultQuery: string;
  setQuery: (query: string) => void;
}) => {
  const pagefind = usePagefind();

  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PagefindSearchAllResult[]>([]);

  const timer = useRef(0);
  const search = useCallback(
    async (query: string) => {
      setQuery(query);

      window.clearTimeout(timer.current);
      setIsSearching(true);
      timer.current = window.setTimeout(async () => {
        // 全角アルファベットの検索でエラーになってしまう
        const searchResults = await pagefind.searchAll(query);
        setIsSearching(false);

        if (!searchResults) {
          return;
        }

        setResults(searchResults);
      }, 300);
    },
    [pagefind, setQuery]
  );

  const [_defaultQuery] = useState(defaultQuery);
  useEffect(() => {
    (async () => {
      search(_defaultQuery);
    })();
  }, [_defaultQuery, search]);

  return { isSearching, results, search: search };
};
