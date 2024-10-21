import type { Route } from "next";
import NextLink from "next/link";
import type { PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const link = tv({
  base: "text-base underline underline-offset-4 transition-colors hover:text-zinc-400 w-fit",
  variants: { size: { md: "text-base", sm: "text-sm" } },
  defaultVariants: { size: "md" },
});

type Props<T extends string> = {
  href: Route<T>;
  onClick?: () => void;
} & PropsWithChildren &
  VariantProps<typeof link>;

export const TextLink = <T extends string>({
  href,
  children,
  onClick,
  size = "md",
}: Props<T>) => {
  return (
    <NextLink href={href} className={link({ size })} onClick={onClick}>
      {children}
    </NextLink>
  );
};
