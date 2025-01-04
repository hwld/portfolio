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
  useCallback,
} from "react";
import { type Root } from "hast";

type TocContext = {
  tocHAst: Root | undefined;
  setTocHAst: (hAst: Root | undefined) => void;

  isLinkActive: (href: string) => boolean;
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
  const [activeHrefs, setActiveHrefs] = useState<string[]>([]);

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
        const heading = entry.target.querySelector("h1, h2, h3, h4, h5, h6");
        const id = heading?.getAttribute("id");
        if (!id) {
          return;
        }

        const headingHref = `#${encodeURIComponent(id)}`;

        if (entry.isIntersecting) {
          setActiveHrefs((hrefs) => [...hrefs, headingHref]);
          scrollTocAnchorIntoView(headingHref);
        } else {
          setActiveHrefs((hrefs) =>
            hrefs.filter((href) => href !== headingHref)
          );
        }
      });
    });

    headingSections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      setActiveHrefs([]);
    };
  }, [tocHAst]);

  const isLinkActive = useCallback(
    (href: string) => {
      return activeHrefs.includes(href);
    },
    [activeHrefs]
  );

  return (
    <TocContext.Provider
      value={{
        tocHAst,
        setTocHAst,
        isLinkActive,
      }}
    >
      {children}
    </TocContext.Provider>
  );
};

const tocAnchorClass = "toc-anchor";

export const TocAnchor = (props: ComponentPropsWithoutRef<"a">) => {
  const { isLinkActive } = useToc();

  const isActive = isLinkActive(props.href ?? "");

  return (
    <a
      className={clsx(
        tocAnchorClass,
        "min-h-8 py-1 px-2 flex rounded items-center hover:bg-white/20 transition-colors break-all text-sm my-1",
        isActive && "text-sky-400"
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

// ToCのリンクが見えるようにスクロールする
const scrollTocAnchorIntoView = (href: string) => {
  // デスクトップとモバイルなど、複数のリンクがある場合があるので全て取得する
  const anchorElements = document.querySelectorAll(
    `.${tocAnchorClass}[href='${href}']`
  );

  anchorElements.forEach((e) => {
    if (e.checkVisibility()) {
      e.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
};
