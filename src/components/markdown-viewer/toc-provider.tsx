"use client";

import { DATA_PREV_HREF } from "@/lib/unified";
import clsx from "clsx";
import {
  createContext,
  useContext,
  type PropsWithChildren,
  type ComponentPropsWithoutRef,
  useEffect,
  useState,
  useRef,
  type RefObject,
} from "react";

type TocContext = {
  activeLink: string | undefined;
  active: (href: string | undefined) => void;

  isScrollingRef: RefObject<boolean>;
};
const TocContext = createContext<TocContext | undefined>(undefined);

export const useToc = () => {
  const ctx = useContext(TocContext);
  if (!ctx) {
    throw new Error("TocContextProviderが存在しません");
  }

  return ctx;
};

export const TocContextProvider: React.FC<
  { contentId: string } & PropsWithChildren
> = ({ contentId, children }) => {
  const [activeLink, setActiveLink] = useState<string | undefined>();

  const isScrollingRef = useRef(false);
  useEffect(() => {
    const handleScroll = () => {
      isScrollingRef.current = true;
    };
    const handleScrollEnd = () => {
      isScrollingRef.current = false;
    };

    document.addEventListener("scroll", handleScroll);
    document.addEventListener("scrollend", handleScrollEnd);

    return () => {
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scrollend", handleScrollEnd);
      isScrollingRef.current = false;
    };
  }, []);

  useEffect(() => {
    const content = document.querySelector(`#${contentId}`);
    if (!content) {
      return;
    }

    const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!isScrollingRef.current) {
            return;
          }

          const headingHref = `#${encodeURIComponent(entry.target.id)}`;

          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            // headingが上から外に出ていった場合はリンクをアクティブにする
            setActiveLink(headingHref);
            return;
          }

          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
            // headingが下から外に出ていった場合は前のリンクをアクティブにする
            setActiveLink(headingHref);
            return;
          }
        });
      },
      { root: null, rootMargin: "0px 0px -90% 0px", threshold: 0 }
    );

    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, [contentId]);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveLink(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <TocContext.Provider
      value={{
        activeLink,
        active: setActiveLink,
        isScrollingRef,
      }}
    >
      {children}
    </TocContext.Provider>
  );
};

export const Anchor = (
  props: ComponentPropsWithoutRef<"a"> & { [DATA_PREV_HREF]?: string }
) => {
  const { activeLink } = useToc();
  const isActive = activeLink === props.href;

  return (
    <a
      className={clsx(
        "min-h-8 py-1 px-2 flex rounded items-center hover:bg-white/20 transition-colors break-all text-sm my-1",
        isActive ? "text-sky-400" : ""
      )}
      {...props}
    />
  );
};
