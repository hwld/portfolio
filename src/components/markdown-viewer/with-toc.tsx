import { getTocHAst } from "@/lib/unified";
import { MarkdownViewer } from "./markdown-viewer";
import { DesktopToc } from "./desktop-toc";
import { TocHAstSetter } from "./toc-provider";

type Props = { markdown: string };

export const MarkdownViewerWithToc: React.FC<Props> = async ({ markdown }) => {
  const tocHAst = await getTocHAst(markdown);
  const hasToc = tocHAst.children.length > 0;

  return (
    <div className="relative w-full gap-8 grid grid-cols-[minmax(100%,700px)_300px]">
      <MarkdownViewer>{markdown}</MarkdownViewer>
      {hasToc ? (
        <>
          <TocHAstSetter hAst={tocHAst} />
          <div className="block max-[1200px]:hidden">
            <DesktopToc hAst={tocHAst} />
          </div>
        </>
      ) : null}
    </div>
  );
};
