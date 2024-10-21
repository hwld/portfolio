import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { TbSearch } from "@react-icons/all-files/tb/TbSearch";
import { TbGhost2 } from "@react-icons/all-files/tb/TbGhost2";
import { TbGhost3 } from "@react-icons/all-files/tb/TbGhost3";
import { MdOutlineSubdirectoryArrowRight } from "@react-icons/all-files/md/MdOutlineSubdirectoryArrowRight";
import {
  useState,
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import {
  FloatingFocusManager,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import type { PagefindSearchAllResult } from "@/lib/pagefind";
import { useRouter } from "next/navigation";
import { usePagefind } from "./pagefind-provider";
import { TextLink } from "./link";

export const SearchBoxTrigger: React.FC = () => {
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
      <AnimatePresence>
        {isOpen ? (
          <FloatingFocusManager context={context}>
            <SearchBox
              {...getFloatingProps()}
              ref={refs.setFloating}
              style={floatingStyles}
              onClose={() => setIsOpen(false)}
            />
          </FloatingFocusManager>
        ) : null}
      </AnimatePresence>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="size-10 rounded-full bg-zinc-800 border border-zinc-500 shadow-lg grid place-items-center transition-colors hover:bg-zinc-600"
      >
        <TbSearch className="size-5" />
      </button>
    </div>
  );
};

export const SearchBox = forwardRef<
  HTMLDivElement,
  { onClose: () => void } & ComponentPropsWithoutRef<"div">
>(function SearchBox({ onClose, ...props }, ref) {
  const pagefind = usePagefind();

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PagefindSearchAllResult[]>([]);

  const router = useRouter();
  const handleSelectCommandItem = (url: string) => {
    router.push(url);
    onClose();
  };

  const timer = useRef(0);
  const handleSearch = async (query: string) => {
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
  };

  return (
    <div ref={ref} className="w-full" {...props}>
      <Command shouldFilter={false} className="focus-visible:outline-none">
        <motion.div
          className="bg-zinc-800 rounded-lg overflow-hidden shadow-xl border border-zinc-500 h-[500px] grid grid-rows-[auto_1fr_auto]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="bg-zinc-700 py-1 px-2 text-xs flex items-center justify-between">
            <p>ページ検索</p>
            <p className="text-zinc-400">Cmd + K</p>
          </div>
          <Command.List className="overflow-auto flex flex-col scroll-py-2">
            {isSearching ? null : (
              <Command.Empty className="pt-20">
                {query.length > 0 ? (
                  <div className="flex flex-col gap-2 items-center">
                    <TbGhost2 className="size-24" />
                    <p>ページが見つかりませんでした</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    <TbGhost3 className="size-24" />
                    <p>ページを検索することができます</p>
                  </div>
                )}
              </Command.Empty>
            )}
            {results.map((r) => {
              return (
                <div
                  key={r.id}
                  className="border-b border-zinc-600 p-2 flex flex-col gap-2"
                >
                  <div className="grid grid-cols-[auto_1fr] gap-1 items-start">
                    <p className="text-zinc-400 leading-6">Page:</p>
                    <Command.Item
                      asChild
                      value={r.id}
                      onSelect={() => handleSelectCommandItem(r.url)}
                      className="w-fit data-[selected=true]:text-sky-400"
                    >
                      <TextLink href={r.url} onClick={onClose}>
                        {r.meta?.title ?? "不明なタイトル"}
                      </TextLink>
                    </Command.Item>
                  </div>
                  <div className="ml-2 flex flex-col gap-2">
                    {r.sub_results.map((sub, i) => {
                      return (
                        <Command.Item
                          key={i}
                          value={`${r.id}-${sub.url}`}
                          onSelect={() => handleSelectCommandItem(sub.url)}
                          className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-1 group items-center data-[selected=true]:bg-white/10 p-1 rounded cursor-pointer"
                        >
                          <MdOutlineSubdirectoryArrowRight className="size-4" />
                          <TextLink
                            size="sm"
                            href={sub.url}
                            onClick={onClose}
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
            })}
          </Command.List>
          <div className="border-t border-zinc-500 p-2">
            <div className="relative h-9">
              <div className="h-full aspect-square grid place-items-center absolute left-0 top-0">
                <TbSearch className="size-5" />
              </div>
              <Command.Input
                autoFocus
                className="inset-y-0 pl-8 pr-2 text-sm border border-zinc-400 rounded w-full h-full focus-visible:outline-none focus-visible:border-zinc-300"
                // NotoSansだと全角アルファベットでbaselineがずれるので
                style={{ fontFamily: "sans-serif" }}
                value={query}
                onValueChange={handleSearch}
                placeholder="キーワード"
              />
            </div>
          </div>
        </motion.div>
      </Command>
    </div>
  );
});
