"use client";

import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  offset,
  size,
  autoUpdate,
} from "@floating-ui/react";
import { TbMenu2, TbX } from "react-icons/tb";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { tocAnchorClass, useToc } from "./toc-provider";
import { Toc } from "./toc";
import {
  NavbarSheet,
  NavbarSheetBody,
  NavbarSheetHeader,
} from "../navbar/sheet";
import { NavbarButton } from "../navbar/button";
import { Root } from "hast";

export const MobileTocButton: React.FC = () => {
  const { tocHAst } = useToc();

  const [isOpen, setIsOpen] = useState(false);
  const ButtonIcon = isOpen ? TbX : TbMenu2;

  const handleClickAnchor = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      setIsOpen(false);
    }
  };

  const [availableHeight, setAvailableHeight] = useState("0px");

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top-start",
    middleware: [
      offset(8),
      size({
        apply: ({ availableHeight }) => {
          flushSync(() => {
            setAvailableHeight(`${availableHeight}px`);
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  if (!tocHAst) {
    return <div className="size-10" />;
  }

  return (
    <>
      <NavbarSheet
        ref={refs.setFloating}
        isOpen={isOpen}
        floatingContext={context}
        style={floatingStyles}
        onClick={handleClickAnchor}
        {...getFloatingProps()}
        maxHeight={`calc(${availableHeight} - 16px)`}
      >
        <NavbarSheetHeader>目次</NavbarSheetHeader>
        <NavbarSheetBody>
          <MobileToc hAst={tocHAst} />
        </NavbarSheetBody>
      </NavbarSheet>
      <NavbarButton
        ref={refs.setReference}
        {...getReferenceProps()}
        icon={ButtonIcon}
      />
    </>
  );
};

const mobileTocClass = "mobile-toc";

const MobileToc: React.FC<{ hAst: Root }> = ({ hAst }) => {
  const { activeHrefs } = useToc();

  useEffect(() => {
    const toc = document.querySelector(`.${mobileTocClass}`);
    const activeAnchors = activeHrefs.map((href) => {
      return toc?.querySelector(`.${tocAnchorClass}[href="${href}"]`) || null;
    });

    const bottomMost = getBottomElement(
      activeAnchors.filter((anchor) => anchor !== null)
    );

    window.setTimeout(() => {
      bottomMost?.scrollIntoView({ block: "end" });
    }, 0);
  }, [activeHrefs]);

  return (
    <div className={mobileTocClass}>
      <Toc hAst={hAst} />
    </div>
  );
};

/**
 * 要素の配列から一番下にある要素を取得する
 */
const getBottomElement = (elements: Element[]): Element | null => {
  return elements.reduce<Element | null>((bottomMost, el) => {
    if (
      el.getBoundingClientRect().bottom >
      (bottomMost?.getBoundingClientRect().bottom || -Infinity)
    ) {
      return el;
    } else {
      return bottomMost;
    }
  }, null);
};
