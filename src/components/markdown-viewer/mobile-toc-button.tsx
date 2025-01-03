"use client";

import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  offset,
  size,
  autoUpdate,
  FloatingFocusManager,
} from "@floating-ui/react";
import { TbMenu2 } from "@react-icons/all-files/tb/TbMenu2";
import { TbX } from "@react-icons/all-files/tb/TbX";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useToc } from "./toc-provider";
import { Toc } from "./toc";

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
      <AnimatePresence>
        {isOpen ? (
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              style={floatingStyles}
              className="w-full"
            >
              <motion.div
                onClick={handleClickAnchor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full bg-navbar-background border border-navbar-border rounded-lg shadow-xl overflow-hidden text-navbar-foreground flex flex-col"
                style={{ maxHeight: `calc(${availableHeight} - 16px)` }}
              >
                <div className="p-2 text-xs flex items-center border-b border-navbar-border">
                  目次
                </div>
                <div className="p-2 overflow-auto">
                  <Toc hAst={tocHAst} />
                </div>
              </motion.div>
            </div>
          </FloatingFocusManager>
        ) : null}
      </AnimatePresence>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="size-10 border bg-navbar-background border-navbar-border grid place-items-center hover:bg-navbar-background-hover transition-colors rounded-full text-navbar-foreground"
      >
        <ButtonIcon className="size-5" />
      </button>
    </>
  );
};
