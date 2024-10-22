import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PagefindProvider } from "@/components/pagefind-provider";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "hwld",
  description: "hwld portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" style={{ scrollbarGutter: "stable" }}>
      <PagefindProvider>
        <body
          className={`${noto.className} min-h-screen bg-zinc-900 text-zinc-300 font-light text-sm`}
          style={{ colorScheme: "dark" }}
        >
          {children}
          <Navbar />
        </body>
      </PagefindProvider>
      <GoogleAnalytics gaId="G-V2PYBBQFQ8" />
    </html>
  );
}
