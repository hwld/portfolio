import rehypeShiki from "@shikijs/rehype";
import clsx from "clsx";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import {
  PropsWithChildren,
  ComponentPropsWithoutRef,
  Fragment,
  CSSProperties,
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import remarkParse from "remark-parse";
import remarkCallout from "@r4ai/remark-callout";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeSectionize from "@hbsnow/rehype-sectionize";
import { unified } from "unified";
import { CodeCopyButton } from "./code-copy-button";
import rehypeSlug from "rehype-slug";
import { HEADING_ID_PREFIX } from "@/lib/unified";
import { tv, type VariantProps } from "tailwind-variants";
import Link from "next/link";
import { MaybeCalloutRelatedDiv } from "./callout";
import { MAKRDOWN_VIEWER_ID } from "./consts";
import matter from "gray-matter";

type Props = { children: string };

export const MarkdownViewer: React.FC<Props> = async ({ children }) => {
  // front matterを除去する
  const { content } = matter(children);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCallout)
    .use(remarkRehype)
    .use(rehypeSlug, { prefix: HEADING_ID_PREFIX })
    .use(rehypeSectionize)
    .use(rehypeShiki, { theme: "github-dark-default", addLanguageClass: true });

  const mdast = processor.parse(content);

  // shikiはrunを使用する必要があるが、ReactMarkdownはrunSyncを実行するので、
  // ReactMarkdownは使用しない
  // https://github.com/remarkjs/react-markdown/issues/680
  const hast = await processor.run(mdast, content);

  return (
    <div
      id={MAKRDOWN_VIEWER_ID}
      className="text-base break-all [&>*:first-child]:mt-0!"
    >
      {toJsxRuntime(hast, {
        Fragment: Fragment,
        jsx,
        jsxs,
        components: {
          div: Div,
          h1: H1,
          h2: H2,
          h3: H3,
          h4: H4,
          h5: H5,
          h6: H6,
          p: P,
          a: A,
          img: Img,
          ul: Ul,
          ol: Ol,
          li: Li,
          strong: Strong,
          code: Code,
          pre: Pre,
          hr: Hr,
          blockquote: BlockQuote,
        },
      })}
    </div>
  );
};

const defaultMargin = "24px";

const Div = (props: ComponentPropsWithoutRef<"div">) => {
  const CalloutRelativeComponent = (
    <MaybeCalloutRelatedDiv defaultMargin={defaultMargin} {...props} />
  );

  if (CalloutRelativeComponent) {
    return CalloutRelativeComponent;
  } else {
    return <div {...props} />;
  }
};

// コードブロックのみで使われることを想定している
const Pre = ({
  className,
  style,
  ...props
}: PropsWithChildren & { className?: string; style?: CSSProperties }) => {
  const { backgroundColor: _, ...bgRemovedStyle } = style || {};

  return (
    <div
      className={clsx("group relative", className)}
      style={{ marginTop: defaultMargin }}
    >
      <pre
        {...props}
        style={{ ...bgRemovedStyle }}
        className="overflow-auto rounded-md border border-border bg-zinc-500/5 px-5 py-6 focus-visible:outline-hidden"
      />
    </div>
  );
};

// コードブロックとコードスパンで使用される
const Code = ({
  className,
  ...props
}: PropsWithChildren & { className?: string }) => {
  // codeブロックの場合はlanguageがクラス名に含まれているので、そこから言語を取得する
  const lang = className?.match(/language-(\w+)/)?.[1];

  // コードをコピーするために、code要素を特定する必要があるので、idを使用する。
  // refを使いたかったが、できるだけRSCを使いたいので、このIdを使ってDOMを直接触る
  const codeId = `code-${crypto.randomUUID()}`;

  return (
    <>
      {lang && (
        <>
          <div className="absolute top-2 right-2 rounded-sm text-xs text-foreground-muted select-none">
            {lang}
          </div>
          {/* codeブロックかをlangの有無で確認してる */}
          <CodeCopyButton codeId={codeId} />
        </>
      )}
      <code
        id={codeId}
        className={clsx(
          "break-all [:not(pre)>&]:mx-1 [:not(pre)>&]:rounded-sm [:not(pre)>&]:bg-background-muted [:not(pre)>&]:px-1.5 [:not(pre)>&]:py-[3px] [:not(pre)>&]:text-foreground",
          className
        )}
        {...props}
      />
    </>
  );
};

const P = ({ children }: PropsWithChildren) => {
  return (
    <p className="leading-7" style={{ marginTop: defaultMargin }}>
      {children}
    </p>
  );
};

const headingClass = tv({
  base: "group mb-6 flex items-center gap-0 font-bold text-foreground-strong",
  variants: {
    tag: {
      h1: "mt-12 text-3xl",
      h2: "mt-10 ml-0 text-2xl",
      h3: "mt-8 text-xl",
      h4: "mt-6 text-lg",
      h5: "mt-6 text-lg",
      h6: "mt-6 text-lg",
    },
  },
});

const Heading = ({
  children,
  tag = "h1",
  ...props
}: ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6"> &
  VariantProps<typeof headingClass>) => {
  const heading = headingClass({ tag });

  const href = props.id ? `#${encodeURIComponent(props.id)}` : undefined;
  const HeadingComponent = tag;

  return (
    <HeadingComponent {...props} className={heading}>
      <a
        className="relative h-6 w-0 before:absolute before:top-0 before:right-0 before:block before:h-6 before:w-7 before:bg-[url('/icons/link.svg')] before:bg-contain before:bg-center before:bg-no-repeat before:pr-1 before:opacity-0 before:transition-opacity before:content-[''] group-hover:before:opacity-100"
        href={href}
        aria-label="見出しへのリンク"
      />
      {children}
    </HeadingComponent>
  );
};

const H1 = (props: ComponentPropsWithoutRef<"h1">) => {
  return <Heading tag="h1" {...props} />;
};

const H2 = (props: ComponentPropsWithoutRef<"h2">) => {
  return <Heading tag="h2" {...props} />;
};

const H3 = (props: ComponentPropsWithoutRef<"h3">) => {
  return <Heading tag="h3" {...props} />;
};

const H4 = (props: ComponentPropsWithoutRef<"h4">) => {
  return <Heading tag="h4" {...props} />;
};

const H5 = (props: ComponentPropsWithoutRef<"h4">) => {
  return <Heading tag="h5" {...props} />;
};

const H6 = (props: ComponentPropsWithoutRef<"h4">) => {
  return <Heading tag="h6" {...props} />;
};

const A = ({ children, href }: ComponentPropsWithoutRef<"a">) => {
  const className = "mx-1 text-sky-400 underline underline-offset-2";

  if (href?.startsWith("#")) {
    return (
      <Link
        href={`#${HEADING_ID_PREFIX}${href.split("#")[1]}`}
        className={className}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <a href={href} target="_blank" className={className}>
        {children}
      </a>
    );
  }
};

const Img = ({ src, alt }: ComponentPropsWithoutRef<"img">) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      // Imgの次にemが来る場合には、それをキャプションとみなして画像の下のマージンをつけない
      className="mt-(--margin) [&:not(:has(+em))]:mb-(--margin)"
      style={{ ["--margin" as string]: defaultMargin }}
    />
  );
};

const Ul = ({ children }: PropsWithChildren) => {
  return (
    <ul
      className="group list-disc pl-5 group-has-[ol]:mt-0! group-has-[ul]:mt-0! marker:text-foreground-muted"
      style={{ marginTop: defaultMargin }}
    >
      {children}
    </ul>
  );
};

const Ol = ({ children }: PropsWithChildren) => {
  return (
    <ol
      className="group list-decimal pl-5 group-has-[ol]:mt-0! group-has-[ul]:mt-0! marker:text-foreground-muted"
      style={{ marginTop: defaultMargin }}
    >
      {children}
    </ol>
  );
};

const Li = ({ children }: PropsWithChildren) => {
  return <li className="my-2">{children}</li>;
};

const Strong = ({ children }: PropsWithChildren) => {
  return (
    <strong className="font-bold text-foreground-strong">{children}</strong>
  );
};

const Hr = ({ children }: PropsWithChildren) => {
  return (
    <hr className="border-border" style={{ marginTop: defaultMargin }}>
      {children}
    </hr>
  );
};

const BlockQuote = ({ children }: PropsWithChildren) => {
  return (
    <blockquote
      className="relative border-l-2 border-border-strong px-4 py-1 text-foreground/80 [&>p:first-child]:mt-0!"
      style={{ marginBlock: defaultMargin }}
    >
      {children}
    </blockquote>
  );
};
