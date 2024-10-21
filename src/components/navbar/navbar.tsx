"use client";
import { useMediaQuery } from "@mantine/hooks";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { AnimatePresence, motion } from "framer-motion";
import { TbSearch } from "@react-icons/all-files/tb/TbSearch";
import { useState, type ComponentPropsWithoutRef, forwardRef } from "react";
import {
  FloatingFocusManager,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { usePagefind } from "../pagefind-provider";
import type { PagefindSearchAllResult } from "@/lib/pagefind";
import { TextLink } from "../link";
import type { Route } from "next";
import { TbCornerRightUp } from "@react-icons/all-files/tb/TbCornerRightUp";

export const Navbar: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 700px)");

  if (isMobile === undefined) {
    return;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className={"fixed bottom-6 left-1/2 flex gap-2"}
        key={String(isMobile)}
        initial={{ opacity: 0, y: 10, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 10, x: "-50%" }}
      >
        {isMobile ? <MobileNavbar /> : <DesktopNavbar />}
        <SearchButton />
      </motion.div>
    </AnimatePresence>
  );
};

export const SearchButton: React.FC = () => {
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

  const [results, setResults] = useState<PagefindSearchAllResult[]>([]);

  const handleChangeQuery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    // 全角アルファベットを入力するとエラーが出てしまうが、対処法がわからないので
    // そのままにしておく
    const searchResults = await pagefind.debouncedSearchAll(query);
    if (!searchResults) {
      return;
    }
    setResults(searchResults);
  };

  return (
    <div ref={ref} className="w-full" {...props}>
      <motion.div
        className="bg-zinc-800 rounded-lg overflow-hidden shadow-xl border border-zinc-500 h-[500px] grid grid-rows-[auto_1fr_auto]"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
      >
        <div className="bg-zinc-700 py-1 px-2 text-xs">ページ検索</div>
        <div className="overflow-auto flex flex-col">
          {results.map((r) => {
            return (
              <div
                key={r.id}
                className="border-b border-zinc-600 p-2 flex flex-col gap-4"
              >
                <div className="sticky top-0 bg-zinc-800">
                  <TextLink href={r.url as Route} onClick={onClose}>
                    {r.meta?.title ?? "不明なタイトル"}
                  </TextLink>
                </div>
                <div className="ml-2 flex flex-col gap-4">
                  {r.sub_results.map((sub, i) => {
                    return (
                      <div
                        key={i}
                        className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-1 items-center"
                      >
                        <TbCornerRightUp className="rotate-90 size-4" />
                        <TextLink
                          size="sm"
                          href={sub.url as Route}
                          onClick={onClose}
                        >
                          {sub.title}
                        </TextLink>
                        <p
                          className="col-start-2"
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
        <div className="border-t border-zinc-500 p-2">
          <div className="relative h-9">
            <div className="h-full aspect-square grid place-items-center absolute left-0 top-0">
              <TbSearch className="size-5" />
            </div>
            <input
              autoFocus
              className="inset-y-0 pl-8 pr-2 text-sm border border-zinc-400 rounded w-full h-full focus-visible:outline-none focus-visible:border-zinc-300"
              // NotoSansだと全角アルファベットでbaselineがずれるので
              style={{ fontFamily: "sans-serif" }}
              onChange={handleChangeQuery}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});
