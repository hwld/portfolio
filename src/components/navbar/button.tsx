import { IconType } from "@react-icons/all-files";
import Link, { LinkProps } from "next/link";
import { ComponentPropsWithRef, forwardRef } from "react";
import { tv } from "tailwind-variants";

const navbarButton = tv({
  slots: {
    button:
      "size-11 rounded-full bg-navbar-background text-navbar-foreground border-2 border-navbar-border grid place-items-center transition-colors hover:bg-navbar-background-hover shadow-navbar",
    icon: "size-5",
  },
});

type NavbarButtonProps = { icon: IconType } & ComponentPropsWithRef<"button">;

export const NavbarButton = forwardRef<HTMLButtonElement, NavbarButtonProps>(
  function NavbarButton({ icon, ...props }, ref) {
    const Icon = icon;
    const classes = navbarButton();

    return (
      <button {...props} ref={ref} className={classes.button()}>
        <Icon className={classes.icon()} />
      </button>
    );
  }
);

type NavbarButtonLinkProps = {
  icon: IconType;
  label: string;
} & LinkProps;

export const NavbarButtonLink = forwardRef<
  HTMLAnchorElement,
  NavbarButtonLinkProps
>(function NavbarButtonLink({ icon, href, label, ...props }, ref) {
  const Icon = icon;
  const classes = navbarButton();

  return (
    <Link
      {...props}
      ref={ref}
      href={href}
      aria-label={label}
      className={classes.button()}
    >
      <Icon className={classes.icon()} />
    </Link>
  );
});
