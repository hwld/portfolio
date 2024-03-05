import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

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
        className={`${noto.className} min-h-screen bg-zinc-900 text-zinc-100 font-medium`}
      >
        {children}
      </body>
    </html>
  );
}
