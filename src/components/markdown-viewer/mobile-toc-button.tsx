"use client";

import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
  offset,
  FloatingOverlay,
} from "@floating-ui/react";
import { TbChevronDown } from "@react-icons/all-files/tb/TbChevronDown";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

type Props = { children: ReactNode };

export const MobileTocButton: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [offset(8)],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="h-8 bg-zinc-800 border border-zinc-500 px-2 rounded grid place-items-center grid-cols-[auto_1fr] items-center gap-1 text-zinc-300"
      >
        <span className="text-sm">目次</span>
        <TbChevronDown
          className={clsx(
            "size-5 transition-transform mt-[2px]",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen ? (
          <FloatingPortal>
            <FloatingOverlay>
              <div
                ref={refs.setFloating}
                {...getFloatingProps()}
                style={floatingStyles}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.1 }}
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
