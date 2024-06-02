import clsx from "clsx";
import { PropsWithChildren, ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";

type Props = { children: string };
export const ProjectDetailMarkdown: React.FC<Props> = ({ children }) => {
  return (
    <ReactMarkdown
      components={{
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
        hr: Hr,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

const Code = ({ children }: PropsWithChildren) => {
  return (
    <code className="bg-zinc-300 text-zinc-900 px-1 py-[2px] mx-1 rounded">
      {children}
    </code>
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
  return <li className="my-1">{children}</li>;
};

const Strong = ({ children }: PropsWithChildren) => {
  return <strong className="font-semibold text-zinc-200">{children}</strong>;
};

const Hr = ({ children }: PropsWithChildren) => {
  return <hr className="border-zinc-500 mt-5">{children}</hr>;
};
