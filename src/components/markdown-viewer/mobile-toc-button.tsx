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
import { TbMenu2 } from "@react-icons/all-files/tb/TbMenu2";
import { TbX } from "@react-icons/all-files/tb/TbX";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useToc } from "./toc-provider";
import { Toc } from "./toc";
import {
  NavbarSheet,
  NavbarSheetBody,
  NavbarSheetHeader,
} from "../navbar/sheet";
import { NavbarButton } from "../navbar/button";

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
          <Toc hAst={tocHAst} />
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
