import { TbChevronRight } from "@react-icons/all-files/tb/TbChevronRight";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { getDetailPageTitle } from "@/lib/get-detail-page-title";
import type { IconType } from "@react-icons/all-files";
import {
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import clsx from "clsx";
import {
  allPageLinks,
  PageLink,
  navbarSocialLinks,
  navbarPageLinks,
} from "./consts";
import { NavbarSheet, NavbarSheetBody } from "./sheet";
import { useContentInfo } from "../content/provider";

export const MobileNavbar: React.FC = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8)],
    placement: "top",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <div className="w-[200px]">
      <NavbarSheet
        ref={refs.setFloating}
        isOpen={isOpen}
        floatingContext={context}
        {...getFloatingProps()}
        style={floatingStyles}
      >
        <NavbarSheetBody>
          <div className="grid grid-cols-[1fr_auto_auto]">
            <div className="flex flex-col gap-1">
              {navbarPageLinks.toReversed().map((page) => {
                return (
                  <NavbarItem
                    key={page.path}
                    page={page}
                    currentPath={currentPath}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  />
                );
              })}
            </div>
            <div className="mx-2 h-full w-px bg-border" />
            <div className="flex flex-col justify-end gap-1">
              {navbarSocialLinks.map((link) => {
                return (
                  <SocialLinkItem
                    key={link.uniquePath}
                    label={link.label}
                    icon={link.icon}
                    href={link.href}
                  />
                );
              })}
            </div>
          </div>
        </NavbarSheetBody>
      </NavbarSheet>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="z-10 grid h-11 w-full grid-cols-[1fr_auto] place-items-start items-center gap-4 rounded-full border-2 border-navbar-border bg-navbar-background px-4 text-navbar-foreground shadow-navbar"
      >
        <CurrentPageTitle currentPath={currentPath} />
        <motion.div animate={isOpen ? { rotate: -90 } : { rotate: 0 }}>
          <TbChevronRight className="size-5" />
        </motion.div>
      </button>
    </div>
  );
};

const useCurrentPage = (
  currentPath: string
): { Icon: IconType; title: string } | undefined => {
  const { articleInfos, projectInfos } = useContentInfo();

  const page = allPageLinks.find((p) => p.path === currentPath);
  if (page) {
    return { Icon: page.activeIcon, title: page.title };
  }

  const title = getDetailPageTitle({
    path: currentPath,
    articleInfos,
    projectInfos,
  });
  if (title) {
    return { Icon: title.icon, title: title.label };
  }

  return undefined;
};

// TODO: refactor？
const CurrentPageTitle: React.FC<{ currentPath: string }> = ({
  currentPath,
}) => {
  const currentPage = useCurrentPage(currentPath);

  if (!currentPage) {
    return <div>不明なページ</div>;
  }

  const { Icon, title } = currentPage;

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-1">
      <Icon className="size-5" />
      <p className="truncate whitespace-nowrap">{title}</p>
    </div>
  );
};

const item = tv({
  base: "grid h-8 grid-cols-[auto_1fr] items-center gap-2 rounded-sm px-2 transition-colors",
  variants: {
    active: {
      true: "bg-navbar-foreground text-navbar-background",
      false: "hover:bg-navbar-background-hover",
    },
  },
});

const NavbarItem: React.FC<{
  page: PageLink;
  currentPath: string;
  onClick: () => void;
}> = ({ page, currentPath, onClick }) => {
  const active = page.path === currentPath;
  const Icon = active ? page.activeIcon : page.icon;
  const itemClass = item({ active });

  const content = (
    <>
      <Icon className="size-5" />
      {page.title}
    </>
  );

  return active ? (
    <div className={itemClass}>{content}</div>
  ) : (
    <Link href={page.path} className={itemClass} onClick={onClick}>
      {content}
    </Link>
  );
};

type SocialLinkItemProps = {
  icon: IconType;
  href: string;
  label: string;
};

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({
  icon: Icon,
  href,
  label,
}) => {
  return (
    <a
      aria-label={label}
      target="_blank"
      href={href}
      className={clsx(
        "grid size-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-navbar-background-hover"
      )}
    >
      <Icon className="size-5" />
    </a>
  );
};
