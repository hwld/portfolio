import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { GoogleAnalytics } from "@next/third-parties/google";

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
    <html lang="ja">
      <body
        className={`${noto.className} min-h-screen bg-zinc-900 text-zinc-300 font-light text-sm`}
      >
        <main className="max-w-[1000px] relative pt-14 pb-32 m-auto  px-6 md:px-12 min-h-[100dvh]">
          {children}
        </main>
        <Navbar />
      </body>
      <GoogleAnalytics gaId="G-V2PYBBQFQ8" />
    </html>
  );
}
