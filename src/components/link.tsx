import NextLink from "next/link";
import { forwardRef, type PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const link = tv({
  base: "text-base underline underline-offset-4 transition-colors hover:text-foreground-strong w-fit",
  variants: { size: { md: "text-base", sm: "text-sm", lg: "text-lg" } },
  defaultVariants: { size: "md" },
});

type Props = {
  href: string;
  onClick?: () => void;
  className?: string;
} & PropsWithChildren &
  VariantProps<typeof link>;

export const TextLink = forwardRef<HTMLAnchorElement, Props>(
  ({ href, children, onClick, size = "md", className, ...props }, ref) => {
    return (
      <NextLink
        ref={ref}
        href={href}
        className={link({ size, className })}
        onClick={onClick}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

TextLink.displayName = "TextLink";
