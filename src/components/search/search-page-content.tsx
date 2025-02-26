"use client";

import { TextLink } from "../link";
import { MdOutlineSubdirectoryArrowRight } from "@react-icons/all-files/md/MdOutlineSubdirectoryArrowRight";
import { TbGhost2 } from "@react-icons/all-files/tb/TbGhost2";
import { TbGhost3 } from "@react-icons/all-files/tb/TbGhost3";
import { SearchInput } from "./search-input";
import { useSearchPage } from "./use-search-page";
import { useQueryState, parseAsString } from "nuqs";
import { CgSpinner } from "@react-icons/all-files/cg/CgSpinner";

export const SearchPageContent: React.FC = () => {
  const [query, setQuery] = useQueryState<string>(
    "query",
    parseAsString.withDefault("")
  );
  const { isSearching, results, search } = useSearchPage({
    defaultQuery: query,
    setQuery,
  });

  return (
    <div className="flex flex-col gap-6">
      <SearchInput query={query} onChangeQuery={search} />
      <div className="w-full flex flex-col gap-4">
        {results.length === 0 ? (
          isSearching ? (
            <div className="grid place-items-center mt-10">
              <CgSpinner className="size-8 animate-spin" />
            </div>
          ) : query.length > 0 ? (
            <div className="flex flex-col gap-2 items-center mt-10">
              <TbGhost2 className="size-24" />
              <p>ページが見つかりませんでした</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center mt-10">
              <TbGhost3 className="size-24" />
              <p>ページを検索することができます</p>
            </div>
          )
        ) : null}
        {results.map((r) => {
          return (
            <div
              key={r.id}
              className="border border-border p-4 flex flex-col gap-4 rounded-lg"
            >
              <div className="grid grid-cols-[auto_1fr] gap-1 items-start">
                <p className="text-foreground-muted leading-6">Page:</p>
                <TextLink size="lg" href={r.url}>
                  {r.meta?.title ?? "不明なタイトル"}
                </TextLink>
              </div>
              <div className="ml-2 flex flex-col gap-2">
                {r.sub_results.map((sub, i) => {
                  return (
                    <div
                      key={i}
                      className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-1"
                    >
                      <MdOutlineSubdirectoryArrowRight className="size-4" />
                      <TextLink
                        size="sm"
                        href={sub.url}
                        className="group-data-[selected=true]:text-sky-400"
                      >
                        {sub.title}
                      </TextLink>
                      <p
                        className="col-start-2 break-all"
                        dangerouslySetInnerHTML={{
                          __html: sub.excerpt,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
