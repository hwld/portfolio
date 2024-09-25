import { pages, type PageData } from "@/app/pages";
import { TbChevronRight } from "@react-icons/all-files/tb/TbChevronRight";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { tv } from "tailwind-variants";
import { TbBrandX } from "@react-icons/all-files/tb/TbBrandX";
import { TbBrandGithub } from "@react-icons/all-files/tb/TbBrandGithub";
import { SocialLinkItem } from "./social-link-item";

export const MobileNavbar: React.FC = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentPage = pages.find((p) => p.url === currentPath);

  const content = useMemo(() => {
    if (!currentPage) {
      return <div>不明なページ</div>;
    }

    const Icon = currentPage.activeIcon;
    return (
      <div className="grid items-center grid-cols-[auto_1fr] gap-1">
        <Icon className="size-5" />
        <p className="pb-[2px]">{currentPage.title}</p>
      </div>
    );
  }, [currentPage]);

  return (
    <div className="grid grid-rows-[1fr_auto] w-[250px]">
      <NavContent
        isOpen={isOpen}
        currentPath={currentPath}
        onClose={() => setIsOpen(false)}
      />
      <button
        onClick={() => setIsOpen((s) => !s)}
        className="h-10 w-full bg-zinc-800 border shadow-xl shadow-black/30 border-zinc-600 rounded-lg items-center place-items-start grid grid-cols-[1fr_auto] gap-4 px-4 z-10"
      >
        {content}
        <motion.div animate={isOpen ? { rotate: -90 } : { rotate: 0 }}>
          <TbChevronRight className="size-5" />
        </motion.div>
      </button>
    </div>
  );
};

const NavContent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}> = ({ isOpen, onClose, currentPath }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="bg-zinc-800 border border-zinc-600 rounded-lg mb-3 p-2 flex flex-col gap-2 shadow-xl shadow-black/30"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
        >
          <div className="flex flex-col gap-1">
            {pages.map((p) => {
              return (
                <NavbarItem
                  key={p.url}
                  page={p}
                  currentPath={currentPath}
                  onClick={onClose}
                />
              );
            })}
          </div>
          <div className="w-full bg-zinc-600 h-[1px]" />
          <div className="flex gap-4 items-center justify-between px-2">
            <p className="text-zinc-400">social link</p>
            <div className="flex gap-2 items-center">
              <SocialLinkItem icon={TbBrandX} href="https://x.com/016User" />
              <SocialLinkItem
                icon={TbBrandGithub}
                href="https://github.com/hwld"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const item = tv({
  base: "px-2 h-8 grid grid-cols-[auto_1fr] items-center gap-2 rounded transition-colors border border-transparent",
  variants: {
    active: {
      true: "text-zinc-50 border-zinc-700 bg-zinc-900",
      false: "text-zinc-300 hover:text-zinc-200 hover:bg-zinc-700",
    },
  },
});

const NavbarItem: React.FC<{
  page: PageData;
  currentPath: string;
  onClick: () => void;
}> = ({ page, currentPath, onClick }) => {
  const active = page.url === currentPath;
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
    <Link href={page.url} className={itemClass} onClick={onClick}>
      {content}
    </Link>
  );
};
