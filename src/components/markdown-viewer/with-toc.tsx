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
      <TocContextProvider contentId={viewerId}>
        <div className="hidden min-[1200px]:block">
          {hasToc ? <DesktopToc hast={tocHAst} /> : null}
        </div>
        <div className="block min-[1200px]:hidden fixed top-4 right-4">
          {hasToc ? <MobileToc hast={tocHAst} /> : null}
        </div>
      </TocContextProvider>
    </div>
  );
};
