import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
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
  FloatingFocusManager,
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
import { SearchButton } from "./search-button";

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
      <SearchButton ref={refs.setReference} {...getReferenceProps()} />
    </div>
  );
};

export const SearchBox = forwardRef<
  HTMLDivElement,
  { onClose: () => void } & ComponentPropsWithoutRef<"div">
>(function SearchBox({ onClose, ...props }, ref) {
  const [query, setQuery] = useState("");
  const { isSearching, results, search } = useSearchPage({
    defaultQuery: query,
    setQuery,
  });

  const router = useRouter();
  const handleSelectCommandItem = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <div ref={ref} className="w-full" {...props}>
      <Command shouldFilter={false} className="focus-visible:outline-none">
        <motion.div
          className="bg-zinc-900 rounded-lg overflow-hidden shadow-xl border border-zinc-500 h-[500px] grid grid-rows-[auto_1fr_auto] text-zinc-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="p-2 text-xs flex items-center justify-between border-b border-zinc-500">
            <p>ページ検索</p>
            <p className="text-zinc-400">Cmd + K</p>
          </div>
          <Command.List className="overflow-auto flex flex-col scroll-py-2 relative">
            <Command.Empty className="absolute inset-0 grid place-items-center">
              {isSearching ? (
                <div className="grid place-items-center">
                  <CgSpinner className="size-8 animate-spin" />
                </div>
              ) : query.length > 0 ? (
                <div className="flex flex-col gap-2 items-center -mt-10">
                  <TbGhost2 className="size-24" />
                  <p>ページが見つかりませんでした</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 items-center -mt-10">
                  <TbGhost3 className="size-24" />
                  <p>ページを検索することができます</p>
                  <TextLink size="sm" href={Routes.search()} onClick={onClose}>
                    別ページで検索する
                  </TextLink>
                </div>
              )}
            </Command.Empty>
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
            <Command.Input asChild>
              <SearchInput query={query} onChangeQuery={search} />
            </Command.Input>
          </div>
        </motion.div>
      </Command>
    </div>
  );
});
