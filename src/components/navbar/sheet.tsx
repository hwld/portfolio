import { FloatingFocusManager } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { ComponentPropsWithoutRef, forwardRef, PropsWithChildren } from "react";
import { type FloatingContext } from "@floating-ui/react";

type Props = ComponentPropsWithoutRef<"div"> & {
  isOpen: boolean;
  floatingContext: FloatingContext;
  maxHeight?: string;
};

export const NavbarSheet = forwardRef<HTMLDivElement, Props>(function Sheet(
  { isOpen, floatingContext, children, maxHeight, ...props },
  ref
) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <FloatingFocusManager context={floatingContext}>
          <div {...props} ref={ref} className="w-full">
            <motion.div
              className="bg-navbar-background rounded-lg overflow-hidden shadow-navbar border border-navbar-border text-navbar-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex flex-col" style={{ maxHeight: maxHeight }}>
                {children}
              </div>
            </motion.div>
          </div>
        </FloatingFocusManager>
      ) : null}
    </AnimatePresence>
  );
});

export const NavbarSheetHeader: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="p-2 text-xs flex items-center border-b border-navbar-border">
      {children}
    </div>
  );
};

export const NavbarSheetBody: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="p-2 overflow-auto scroll-p-2">{children}</div>;
};
