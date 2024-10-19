import { getTocHAst } from "@/lib/unified";
import { MarkdownViewer } from "./markdown-viewer";
import { MobileTocButton } from "./mobile-toc-button";
import { Toc } from "./toc";
import { TocContextProvider } from "./toc-provider";

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
          {hasToc ? <Toc hast={tocHAst} /> : null}
        </div>
        <div className="block min-[1200px]:hidden fixed top-4 right-4">
          {hasToc ? (
            <MobileTocButton>
              <Toc hast={tocHAst} />
            </MobileTocButton>
          ) : null}
        </div>
      </TocContextProvider>
    </div>
  );
};
