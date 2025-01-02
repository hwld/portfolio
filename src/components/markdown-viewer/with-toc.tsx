import { getTocHAst } from "@/lib/unified";
import { MarkdownViewer } from "./markdown-viewer";
import { TocContextProvider } from "./toc-provider";
import { DesktopToc } from "./desktop-toc";
import { MobileToc } from "./mobile-toc";

type Props = { markdown: string };

export const MarkdownViewerWithToc: React.FC<Props> = async ({ markdown }) => {
  const viewerId = "viewer";

  const tocHAst = await getTocHAst(markdown);
  const hasToc = tocHAst.children.length > 0;

  return (
    <div className="relative w-full gap-8 grid grid-cols-[minmax(100%,700px)_300px]">
      <MarkdownViewer id={viewerId}>{markdown}</MarkdownViewer>
      {hasToc ? (
        <TocContextProvider contentId={viewerId}>
          <div className="block max-[1200px]:hidden">
            <DesktopToc hAst={tocHAst} />
          </div>
          <MobileToc mobileBreakPointPx={1200} hAst={tocHAst} />
        </TocContextProvider>
      ) : null}
    </div>
  );
};
