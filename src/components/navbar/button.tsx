import { IconType } from "react-icons/lib";
import Link, { LinkProps } from "next/link";
import { ComponentPropsWithRef, forwardRef } from "react";
import { tv } from "tailwind-variants";

const navbarButton = tv({
  slots: {
    button:
      "grid size-11 place-items-center rounded-full border-2 border-navbar-border bg-navbar-background text-navbar-foreground shadow-navbar transition-colors hover:bg-navbar-background-hover",
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
