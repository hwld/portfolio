"use client";

import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
  offset,
  FloatingOverlay,
  size,
  autoUpdate,
} from "@floating-ui/react";
import { TbChevronDown } from "@react-icons/all-files/tb/TbChevronDown";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  mobileToCAvailableHeight,
  mobileToCAvailableWidth,
} from "./mobile-toc";

type Props = {
  children: ReactNode;
};

export const MobileTocButton: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const handleClickAnchor = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      setIsOpen(false);
    }
  };

  const [availableHeight, setAvailableHeight] = useState("0px");
  const [availableWidth, setAvailableWidth] = useState("0px");

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [
      offset(8),
      size({
        apply: ({ availableHeight, availableWidth }) => {
          flushSync(() => {
            setAvailableHeight(`${availableHeight}px`);
            setAvailableWidth(`${availableWidth}px`);
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

  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      // 上にスクロールしたらボタンを表示
      if (window.scrollY < lastScrollY.current) {
        setIsButtonVisible(true);
      }

      // 下にスクロールしたらボタンを非表示
      if (window.scrollY > lastScrollY.current && !isOpen) {
        setIsButtonVisible(false);
      }

      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, setIsButtonVisible]);

  return (
    <>
      <AnimatePresence initial={false}>
        {isButtonVisible ? (
          <motion.button
            ref={refs.setReference}
            {...getReferenceProps()}
            className="h-8 border bg-background border-border-strong px-3 grid place-items-center grid-cols-[auto_1fr] items-center gap-1 hover:bg-background-hover transition-colors rounded-full text-foreground-strong"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm">目次</span>
            <TbChevronDown
              className={clsx(
                "size-5 transition-transform",
                isOpen ? "-rotate-180" : ""
              )}
            />
          </motion.button>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen ? (
          <FloatingPortal>
            <FloatingOverlay>
              <div
                ref={refs.setFloating}
                {...getFloatingProps()}
                style={{
                  ...floatingStyles,
                  [mobileToCAvailableHeight as string]: availableHeight,
                  [mobileToCAvailableWidth as string]: availableWidth,
                }}
              >
                <motion.div
                  onClick={handleClickAnchor}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              </div>
            </FloatingOverlay>
          </FloatingPortal>
        ) : null}
      </AnimatePresence>
    </>
  );
};
