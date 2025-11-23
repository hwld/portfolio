import { Command } from "cmdk";
import { TbGhost2 } from "@react-icons/all-files/tb/TbGhost2";
import { TbGhost3 } from "@react-icons/all-files/tb/TbGhost3";
import { MdOutlineSubdirectoryArrowRight } from "@react-icons/all-files/md/MdOutlineSubdirectoryArrowRight";
import { CgSpinner } from "@react-icons/all-files/cg/CgSpinner";
import {
  useState,
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
} from "react";
import {
  FloatingContext,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useRouter } from "next/navigation";
import { TextLink } from "../link";
import { Routes } from "@/routes";
import { SearchInput } from "./search-input";
import { useSearchPage } from "./use-search-page";
import { NavbarSheet, NavbarSheetHeader } from "../navbar/sheet";
import { NavbarButton } from "../navbar/button";
import { TbSearch } from "@react-icons/all-files/tb/TbSearch";
import { PagefindSearchAllResult } from "@/lib/pagefind";

export const SearchSheetTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8)],
    placement: "top-end",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        e.preventDefault();
        setIsOpen((s) => !s);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div>
      <SearchSheet
        isOpen={isOpen}
        floatingContext={context}
        {...getFloatingProps()}
        ref={refs.setFloating}
        style={floatingStyles}
        onClose={() => setIsOpen(false)}
      />
      <NavbarButton
        icon={TbSearch}
        ref={refs.setReference}
        {...getReferenceProps()}
      />
    </div>
  );
};

type SearchSheetProps = {
  onClose: () => void;
  isOpen: boolean;
  floatingContext: FloatingContext;
} & ComponentPropsWithoutRef<"div">;

const SearchSheet = forwardRef<HTMLDivElement, SearchSheetProps>(
  function SearchSheet({ onClose, isOpen, floatingContext, ...props }, ref) {
    const [query, setQuery] = useState("");
    const { isSearching, results, search } = useSearchPage({
      defaultQuery: query,
      setQuery,
    });

    const router = useRouter();
    const handleMovePage = (url: string) => {
      router.push(url);
    };

    const handleBeforeMovePage = () => {
      onClose();
    };

    return (
      <>
        <NavbarSheet
          ref={ref}
          isOpen={isOpen}
          floatingContext={floatingContext}
          {...props}
        >
          <NavbarSheetHeader>
            <div className="flex w-full items-center justify-between">
              <p>ページ検索</p>
              <p className="text-navbar-foreground-muted">Cmd + K</p>
            </div>
          </NavbarSheetHeader>

          <Command
            shouldFilter={false}
            className="w-full focus-visible:outline-hidden"
          >
            <Command.List className="relative flex h-[450px] scroll-py-2 flex-col overflow-auto">
              <Command.Empty className="absolute inset-0 grid place-items-center">
                {isSearching ? (
                  <div className="grid place-items-center">
                    <CgSpinner className="size-8 animate-spin" />
                  </div>
                ) : query.length > 0 ? (
                  <div className="-mt-10 flex flex-col items-center gap-2">
                    <TbGhost2 className="size-24" />
                    <p>ページが見つかりませんでした</p>
                  </div>
                ) : (
                  <div className="-mt-10 flex flex-col items-center gap-2">
                    <TbGhost3 className="size-24" />
                    <p>ページを検索することができます</p>
                    <TextLink
                      size="sm"
                      href={Routes.search()}
                      onClick={onClose}
                    >
                      別ページで検索する
                    </TextLink>
                  </div>
                )}
              </Command.Empty>
              {results.map((r) => {
                return (
                  <SearchResult
                    key={r.id}
                    result={r}
                    onMovePage={handleMovePage}
                    onBeforeMovePage={handleBeforeMovePage}
                  />
                );
              })}
            </Command.List>
            <div className="border-t border-navbar-border p-2">
              <Command.Input asChild>
                <SearchInput query={query} onChangeQuery={search} />
              </Command.Input>
            </div>
          </Command>
        </NavbarSheet>
      </>
    );
  }
);

type SearchResultProps = {
  result: PagefindSearchAllResult;
  onMovePage: (url: string) => void;
  onBeforeMovePage: () => void;
};

const SearchResult: React.FC<SearchResultProps> = ({
  result,
  onMovePage,
  onBeforeMovePage,
}) => {
  const handleSelect = (url: string) => {
    onMovePage(url);
    onBeforeMovePage();
  };

  const handleLinkClick = () => {
    onBeforeMovePage();
  };

  return (
    <div className="flex flex-col gap-2 border-b border-navbar-border p-2">
      <div className="grid grid-cols-[auto_1fr] items-start gap-1">
        <p className="leading-6 text-navbar-foreground-muted">Page:</p>
        <Command.Item
          asChild
          value={result.id}
          onSelect={handleSelect}
          className="w-fit data-[selected=true]:text-sky-400"
        >
          <TextLink href={result.url} onClick={handleLinkClick}>
            {result.meta?.title ?? "不明なタイトル"}
          </TextLink>
        </Command.Item>
      </div>
      <div className="ml-2 flex flex-col gap-2">
        {result.sub_results.map((sub, i) => {
          return (
            <Command.Item
              key={i}
              value={`${result.id}-${sub.url}`}
              onSelect={() => handleSelect(sub.url)}
              className="group grid cursor-pointer grid-cols-[auto_1fr] grid-rows-[auto_1fr] items-center gap-1 rounded-sm p-1 data-[selected=true]:bg-white/10"
            >
              <MdOutlineSubdirectoryArrowRight className="size-4" />
              <TextLink
                size="sm"
                href={sub.url}
                onClick={handleLinkClick}
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
            </Command.Item>
          );
        })}
      </div>
    </div>
  );
};
