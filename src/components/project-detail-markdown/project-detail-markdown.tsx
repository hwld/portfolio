import rehypeShiki from "@shikijs/rehype";
import clsx from "clsx";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { PropsWithChildren, ComponentPropsWithoutRef, Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { CodeCopyButton } from "./code-copy-button";

type Props = { children: string };
export const ProjectDetailMarkdown: React.FC<Props> = async ({ children }) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, { theme: "nord", addLanguageClass: true });

  const mdast = processor.parse(children);

  // shikiはrunを使用する必要があるが、ReactMarkdownはrunSyncを実行するので、
  // ReactMarkdownは使用しない
  // https://github.com/remarkjs/react-markdown/issues/680
  const hast = await processor.run(mdast, children);

  return toJsxRuntime(hast, {
    Fragment: Fragment,
    // @ts-ignore
    jsx,
    // @ts-ignore
    jsxs,
    components: {
      h1: H1,
      h2: H2,
      h3: H3,
      h4: H4,
      h5: H4,
      h6: H4,
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
    },
  });
};

const Pre = ({
  children,
  className,
  ...props
}: PropsWithChildren & { className?: string }) => {
  return (
    <div className={clsx("my-5 relative group", className)}>
      <pre
        {...props}
        className="px-5 py-6 rounded overflow-auto focus-visible:outline-none"
      >
        {children}
      </pre>
    </div>
  );
};

const Code = ({
  children,
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
      >
        {children}
      </code>
    </>
  );
};

const P = ({ children }: PropsWithChildren) => {
  return <p className="mt-5 leading-7">{children}</p>;
};

const headerBaseClass = "flex items-center text-zinc-200 font-bold gap-2 mb-5";

const H1 = ({ children }: PropsWithChildren) => {
  return (
    <h1 className={clsx(headerBaseClass, "text-3xl mt-12")}>{children}</h1>
  );
};

const H2 = ({ children }: PropsWithChildren) => {
  return (
    <h2 className={clsx(headerBaseClass, "text-2xl mt-10")}>{children}</h2>
  );
};

const H3 = ({ children }: PropsWithChildren) => {
  return <h3 className={clsx(headerBaseClass, "text-xl mt-8")}>{children}</h3>;
};

const H4 = ({ children }: PropsWithChildren) => {
  return <h4 className={clsx(headerBaseClass, "text-lg mt-6")}>{children}</h4>;
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
  return <img src={src} alt={alt} className="my-6" />;
};

const Ul = ({ children }: PropsWithChildren) => {
  return (
    <ul className="pl-5 mt-5 list-disc marker:text-zinc-500 group group-has-[ul]:mt-0">
      {children}
    </ul>
  );
};

const Ol = ({ children }: PropsWithChildren) => {
  return (
    <ol className="mt-5 list-decimal marker:text-zinc-400 pl-5">{children}</ol>
  );
};

const Li = ({ children }: PropsWithChildren) => {
  return <li className="my-2">{children}</li>;
};

const Strong = ({ children }: PropsWithChildren) => {
  return <strong className="font-semibold text-zinc-200">{children}</strong>;
};

const Hr = ({ children }: PropsWithChildren) => {
  return <hr className="border-zinc-500 mt-5">{children}</hr>;
};
