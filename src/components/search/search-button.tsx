import { TbSearch } from "@react-icons/all-files/tb/TbSearch";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentPropsWithoutRef<"button">;

const searchButton = tv({
  slots: {
    button:
      "size-10 rounded-full bg-zinc-800 border border-zinc-500 shadow-lg grid place-items-center transition-colors hover:bg-zinc-600",
    icon: "size-5",
  },
});

export const SearchButton = forwardRef<HTMLButtonElement, Props>(
  function SearchButton(props, ref) {
    const classes = searchButton();

    return (
      <button ref={ref} {...props} className={classes.button()}>
        <TbSearch className={classes.icon()} />
      </button>
    );
  }
);

type SearchButtonLinkProps = LinkProps;
export const SearchButtonLink = forwardRef<
  HTMLAnchorElement,
  SearchButtonLinkProps
>(function SearchButton(props, ref) {
  const classes = searchButton();

  return (
    <Link ref={ref} {...props} className={classes.button()}>
      <TbSearch className={classes.icon()} />
    </Link>
  );
});
