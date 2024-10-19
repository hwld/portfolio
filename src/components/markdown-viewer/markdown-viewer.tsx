import rehypeShiki from "@shikijs/rehype";
import clsx from "clsx";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { PropsWithChildren, ComponentPropsWithoutRef, Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import remarkParse from "remark-parse";
import remarkCallout from "@r4ai/remark-callout";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { CodeCopyButton } from "./code-copy-button";
import { TbUserCircle } from "@react-icons/all-files/tb/TbUserCircle";
import { TbInfoCircle } from "@react-icons/all-files/tb/TbInfoCircle";
import rehypeSlug from "rehype-slug";
import { HEADING_ID_PREFIX, rehypeAddPrevHeadingId } from "@/lib/unified";
import { tv, type VariantProps } from "tailwind-variants";

type Props = { children: string; id?: string };

export const MarkdownViewer: React.FC<Props> = async ({ children, id }) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkCallout)
    .use(remarkRehype)
    .use(rehypeSlug, { prefix: HEADING_ID_PREFIX })
    .use(rehypeShiki, { theme: "nord", addLanguageClass: true })
    .use(rehypeAddPrevHeadingId);

  const mdast = processor.parse(children);

  // shikiはrunを使用する必要があるが、ReactMarkdownはrunSyncを実行するので、
  // ReactMarkdownは使用しない
  // https://github.com/remarkjs/react-markdown/issues/680
  const hast = await processor.run(mdast, children);

  return (
    <div id={id}>
      {toJsxRuntime(hast, {
        Fragment: Fragment,
        // @ts-ignore
        jsx,
        // @ts-ignore
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

const Div = (
  props: ComponentPropsWithoutRef<"div"> & {
    "data-callout"?: true;
    "data-callout-type"?: string;
    "data-callout-title"?: true;
    "data-callout-body"?: true;
  }
) => {
  if (props["data-callout-type"] !== undefined) {
    return (
      <Callout {...props} data-callout-type={props["data-callout-type"]} />
    );
  }

  if (props["data-callout-title"]) {
    return (
      <CalloutTitle {...props} data-callout-type={props["data-callout-type"]} />
    );
  }

  if (props["data-callout-body"]) {
    return <CalloutBody {...props} />;
  }

  return <div {...props} />;
};

const Callout = (
  props: ComponentPropsWithoutRef<"div"> & { "data-callout-type": string }
) => {
  return (
    <div
      className="grid grid-cols-[auto_1fr] gap-2 p-4 bg-zinc-800 border border-zinc-700 rounded"
      style={{ marginBlock: defaultMargin }}
      {...props}
    />
  );
};

const CalloutTitle = ({
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  if (children === "Column") {
    return (
      <TbUserCircle className="mt-[2px] size-6 text-green-300" {...props} />
    );
  }

  if (children === "Info") {
    return (
      <TbInfoCircle className="mt-[2px] size-6 text-blue-300" {...props} />
    );
  }

  return null;
};

const CalloutBody = (props: ComponentPropsWithoutRef<"div">) => {
  return <div {...props} className="[&>p:first-child]:!mt-0" />;
};

const Pre = ({
  className,
  ...props
}: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={clsx("relative group", className)}
      style={{ marginTop: defaultMargin }}
    >
      <pre
        {...props}
        className="px-5 py-6 rounded overflow-auto focus-visible:outline-none"
      />
    </div>
  );
};

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
        <div className="text-xs absolute right-2 top-2 rounded text-zinc-400 select-none">
          {lang}
        </div>
      )}
      <CodeCopyButton codeId={codeId} />
      <code
        id={codeId}
        className={clsx(
          "[:not(pre)>&]:bg-zinc-700 [:not(pre)>&]:text-zinc-300 [:not(pre)>&]:px-[6px] [:not(pre)>&]:py-[3px] [:not(pre)>&]:mx-1 [:not(pre)>&]:rounded break-all",
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
  base: "text-zinc-200 flex items-center font-bold mb-6 group gap-0",
  variants: {
    tag: {
      h1: "text-3xl mt-12",
      h2: "text-2xl mt-10 ml-0",
      h3: "text-xl mt-8",
      h4: "text-lg mt-6",
      h5: "text-lg mt-6",
      h6: "text-lg mt-6",
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
        className="relative w-0 h-6 before:bg-[url('/icons/link.svg')] before:contents-[''] before:absolute before:right-0 before:top-0 before:block before:pr-1 before:h-6 before:w-7 before:bg-center before:group-hover:opacity-100 before:opacity-0 before:bg-contain before:bg-no-repeat before:transition-opacity"
        href={href}
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
  return (
    <a
      href={href}
      target="_blank"
      className="text-sky-400 underline underline-offset-2"
    >
      {children}
    </a>
  );
};

const Img = ({ src, alt }: ComponentPropsWithoutRef<"img">) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={{ marginBlock: defaultMargin }} />;
};

const Ul = ({ children }: PropsWithChildren) => {
  return (
    <ul
      className="pl-5 list-disc marker:text-zinc-500 group group-has-[ul]:!mt-0"
      style={{ marginTop: defaultMargin }}
    >
      {children}
    </ul>
  );
};

const Ol = ({ children }: PropsWithChildren) => {
  return (
    <ol
      className="list-decimal marker:text-zinc-400 pl-5"
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
  return <strong className="font-semibold text-zinc-200">{children}</strong>;
};

const Hr = ({ children }: PropsWithChildren) => {
  return (
    <hr className="border-zinc-500" style={{ marginTop: defaultMargin }}>
      {children}
    </hr>
  );
};

const BlockQuote = ({ children }: PropsWithChildren) => {
  return (
    <blockquote
      className="text-zinc-300/80 px-4 py-1 relative border-l-2 border-zinc-400 [&>p:first-child]:!mt-0"
      style={{ marginBlock: defaultMargin }}
    >
      {children}
    </blockquote>
  );
};
