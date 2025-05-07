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
    <div
      ref={navbarRef}
      className="bg-navbar-background border border-navbar-border text-navbar-foreground h-10 w-full p-1 flex items-center gap-[2px] rounded-full relative shadow-navbar"
      onMouseLeave={handleNavbarMouseLeave}
    >
      <AnimatePresence>
        {activeMarker && (
          <motion.div
            className="absolute bg-navbar-foreground rounded-full pointer-events-none -top-[1px] -left-[1px]"
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
            ref={(node) => setNavbarItemRef(node, page.path)}
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
      <div className="h-2/3 bg-navbar-border w-[1px] mx-1" />
      <div className="flex gap-1">
        {navbarSocialLinks.map((link) => {
          return (
            <NavbarSocialLinkItem
              ref={(node) => setNavbarItemRef(node, link.uniquePath)}
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
  );
};

const navbarItem = tv({
  slots: {
    page: "flex gap-1 items-center w-full h-full justify-center pl-3 pr-4",
    social: "size-8 grid place-items-center rounded-full shrink-0",
  },
  variants: {
    isActive: { true: "", false: "" },
  },
  compoundSlots: [
    {
      slots: ["page", "social"],
      className: "transition-colors duration-200 relative rounded-full",
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
