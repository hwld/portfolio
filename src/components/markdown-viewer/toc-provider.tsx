"use client";

import { DATA_PREV_HREF } from "@/lib/unified-plugin";
import clsx from "clsx";
import {
  createContext,
  useContext,
  type PropsWithChildren,
  type ComponentPropsWithoutRef,
  useEffect,
  useState,
} from "react";

type TocContext = {
  activeLink: string | undefined;
  active: (href: string | undefined) => void;
};
const TocContext = createContext<TocContext | undefined>(undefined);

export const TocContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [activeLink, setActiveLink] = useState<string | undefined>();

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
    <TocContext.Provider value={{ activeLink, active: setActiveLink }}>
      {children}
    </TocContext.Provider>
  );
};

export const useToc = () => {
  const ctx = useContext(TocContext);
  if (!ctx) {
    throw new Error("TocContext.Providerが存在しません");
  }

  return ctx;
};

export const Anchor = (
  props: ComponentPropsWithoutRef<"a"> & { [DATA_PREV_HREF]?: string }
) => {
  const { active, activeLink } = useToc();
  const isActive = activeLink === props.href;

  useEffect(() => {
    if (!props.href?.startsWith("#")) {
      return;
    }

    const headingId = decodeURIComponent(props.href);
    const heading = document.querySelector(`${headingId}`);
    if (!heading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio === 1) {
            // ratioが1の場合には、ハッシュパラメータで指定されていることを想定する
            // 別のObserverが同時に発生することがあるので、少し待機する
            window.setTimeout(() => {
              active(props.href);
            }, 50);
            return;
          }

          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            // headingが上から外に出ていった場合はリンクをアクティブにする
            active(props.href);
            return;
          }

          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
            // headingが下から外に出ていった場合は前のリンクをアクティブにする
            if (props[DATA_PREV_HREF]) {
              active(props[DATA_PREV_HREF]);
            }
            return;
          }
        });
      },
      // 画面の上だけを監視する
      { root: null, rootMargin: "0px 0px -90% 0px", threshold: 0 }
    );

    observer.observe(heading);

    return () => {
      observer.disconnect();
    };
  }, [active, props]);

  return (
    <a
      className={clsx(
        "h-8 px-2 flex rounded items-center hover:bg-white/20 transition-colors",
        isActive ? "text-blue-500" : ""
      )}
      data-active={false}
      {...props}
    />
  );
};
