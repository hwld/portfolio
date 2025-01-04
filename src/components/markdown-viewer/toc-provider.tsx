"use client";
import { MAKRDOWN_VIEWER_ID } from "./consts";
import clsx from "clsx";
import {
  createContext,
  useContext,
  type PropsWithChildren,
  type ComponentPropsWithoutRef,
  useEffect,
  useState,
} from "react";
import { type Root } from "hast";

type TocContext = {
  tocHAst: Root | undefined;
  setTocHAst: (hAst: Root | undefined) => void;
};

const TocContext = createContext<TocContext | undefined>(undefined);

export const useToc = () => {
  const ctx = useContext(TocContext);
  if (!ctx) {
    throw new Error("TocContextProviderが存在しません");
  }

  return ctx;
};

export const TocContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [tocHAst, setTocHAst] = useState<Root | undefined>();

  useEffect(() => {
    if (!tocHAst) {
      return;
    }

    const viewer = document.querySelector(`#${MAKRDOWN_VIEWER_ID}`);
    if (!viewer) {
      return;
    }

    const headingSections = viewer.querySelectorAll(".heading");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // セクションの最初のheading要素を取得する
        const heading = entry.target.querySelector("h1, h2, h3, h4, h5, h6");
        const id = heading?.getAttribute("id");
        if (!id) {
          return;
        }

        const headingHref = `#${encodeURIComponent(id)}`;
        const tocLink = document.querySelector(
          `.${tocAnchorClass}[href="${headingHref}"]`
        );

        if (entry.isIntersecting) {
          tocLink?.classList.add("text-sky-400");
          tocLink?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          tocLink?.classList.remove("text-sky-400");
        }
      });
    });

    headingSections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [tocHAst]);

  return (
    <TocContext.Provider
      value={{
        tocHAst,
        setTocHAst,
      }}
    >
      {children}
    </TocContext.Provider>
  );
};

const tocAnchorClass = "toc-anchor";

export const TocAnchor = (props: ComponentPropsWithoutRef<"a">) => {
  return (
    <a
      className={clsx(
        tocAnchorClass,
        "min-h-8 py-1 px-2 flex rounded items-center hover:bg-white/20 transition-colors break-all text-sm my-1"
      )}
      {...props}
    />
  );
};

/**
 *  サーバーコンポーネントではHAstをセットできないため、クライアントコンポーネントとして用意する。
 *  これをサーバーコンポーネントで使う。
 */
export const TocHAstSetter: React.FC<{ hAst: Root }> = ({ hAst }) => {
  const { setTocHAst } = useToc();

  useEffect(() => {
    setTocHAst(hAst);

    return () => {
      setTocHAst(undefined);
    };
  }, [hAst, setTocHAst]);

  return null;
};
