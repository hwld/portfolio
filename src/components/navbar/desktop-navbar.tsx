import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { forwardRef } from "react";
import { tv } from "tailwind-variants";
import { IconType } from "@react-icons/all-files";
import { navbarPageLinks, PageLink, navbarSocialLinks } from "./consts";

/**
 * 現在のパスに対応するNavItemへのマーカー。
 * NavItemがホバーされるとホバーされたNavItemに移動し、ホバーが解除されると現在のパスのNavItemに戻る。
 */
type ActiveMarker = {
  targetPath: string | undefined;
  style: {
    x: number;
    y: number;
    height: number | string;
    width: number;
  };
};

export const DesktopNavbar: React.FC = () => {
  const currentPath = usePathname();
  const navbarRef = useRef<HTMLDivElement>(null);

  // pathとNavItem要素のマッピングを保持する
  const pathNavItemMap = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const setNavbarItemRef = (node: HTMLAnchorElement | null, path: string) => {
    if (node) {
      pathNavItemMap.current.set(path, node);
    } else {
      pathNavItemMap.current.delete(path);
    }
  };

  const [activeMarker, setActiveMarker] = useState<ActiveMarker>();

  const moveActiveMarker = (targetPath: string) => {
    const navbarRect = navbarRef.current?.getBoundingClientRect();
    if (!navbarRect) {
      return;
    }

    const navItem = pathNavItemMap.current.get(targetPath);

    if (navItem) {
      const navItemRect = navItem.getBoundingClientRect();
      setActiveMarker({
        targetPath,
        style: {
          x: navItemRect.x - navbarRect.x,
          y: navItemRect.y - navbarRect.y,
          width: navItemRect.width,
          height: navItemRect.height,
        },
      });
    } else {
      setActiveMarker(undefined);
    }
  };

  const handleNavbarMouseLeave = () => {
    moveActiveMarker(currentPath);
  };

  useEffect(() => {
    moveActiveMarker(currentPath);
  }, [currentPath]);

  return (
    <div className="h-11 w-full rounded-full border-2 border-navbar-border bg-navbar-background p-1 text-navbar-foreground shadow-navbar">
      <div
        ref={navbarRef}
        className="relative flex h-full w-full items-center gap-0.5"
        onMouseLeave={handleNavbarMouseLeave}
      >
        <AnimatePresence>
          {activeMarker && (
            <motion.div
              className="pointer-events-none absolute rounded-full bg-navbar-foreground"
              transition={{ type: "spring", duration: 0.55 }}
              initial={{ ...activeMarker.style, opacity: 0 }}
              animate={{ ...activeMarker.style, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            />
          )}
        </AnimatePresence>
        {navbarPageLinks.map((page) => {
          return (
            <NavbarItem
              ref={(node) => {
                setNavbarItemRef(node, page.path);
              }}
              key={page.title}
              page={page}
              isCurrentPage={page.path === currentPath}
              activeMarker={activeMarker}
              onMoveActiveMarker={moveActiveMarker}
            >
              {page.title}
            </NavbarItem>
          );
        })}
        <div className="mx-1 h-2/3 w-0.5 shrink-0 bg-navbar-border" />
        <div className="flex gap-1">
          {navbarSocialLinks.map((link) => {
            return (
              <NavbarSocialLinkItem
                ref={(node) => {
                  setNavbarItemRef(node, link.uniquePath);
                }}
                key={link.uniquePath}
                uniquePath={link.uniquePath}
                label={link.label}
                icon={link.icon}
                href={link.href}
                activeMarker={activeMarker}
                onMoveActiveMarker={moveActiveMarker}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const navbarItem = tv({
  slots: {
    page: "flex h-full w-full items-center justify-center gap-1 pr-4 pl-3",
    social: "grid size-8 shrink-0 place-items-center rounded-full",
  },
  variants: {
    isActive: { true: "", false: "" },
  },
  compoundSlots: [
    {
      slots: ["page", "social"],
      className: "relative rounded-full transition-colors duration-200",
    },
    {
      slots: ["page", "social"],
      isActive: true,
      className: "text-navbar-background",
    },
  ],
});

type NavbarItemProps = {
  page: PageLink;
  children: string;
  isCurrentPage?: boolean;
  activeMarker?: ActiveMarker;
  onMoveActiveMarker?: (targetPath: string) => void;
};

const NavbarItem = forwardRef<HTMLAnchorElement, NavbarItemProps>(
  function NavbarItem(
    { page, children, isCurrentPage = false, activeMarker, onMoveActiveMarker },
    ref
  ) {
    const isActive = activeMarker?.targetPath === page.path;
    const itemClass = navbarItem({ isActive }).page();
    const Icon = isCurrentPage ? page.activeIcon : page.icon;

    const handlePointerEnter = () => {
      onMoveActiveMarker?.(page.path);
    };

    return (
      <Link
        ref={ref}
        href={page.path}
        onPointerEnter={handlePointerEnter}
        className={itemClass}
      >
        <Icon className="size-5" />
        <div>{children}</div>
      </Link>
    );
  }
);

type NavbarSocialLinkItemProps = {
  uniquePath: string;
  icon: IconType;
  href: string;
  activeMarker?: ActiveMarker;
  onMoveActiveMarker: (targetPath: string) => void;
  label: string;
};

const NavbarSocialLinkItem = forwardRef<
  HTMLAnchorElement,
  NavbarSocialLinkItemProps
>(function NavbarSocialLinkItem(
  { uniquePath, label, href, icon: Icon, onMoveActiveMarker, activeMarker },
  ref
) {
  const isActive = activeMarker?.targetPath === uniquePath;
  const itemClass = navbarItem({ isActive }).social();

  const handlePointerEnter = () => {
    onMoveActiveMarker(uniquePath);
  };

  return (
    <a
      ref={ref}
      aria-label={label}
      target="_blank"
      href={href}
      className={itemClass}
      onPointerEnter={handlePointerEnter}
    >
      <Icon className="size-5" />
    </a>
  );
});
