import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PagefindProvider } from "@/components/pagefind-provider";

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
      <head>
        <meta
          name="google-site-verification"
          content="8h0KC_lm97miN_H49N2-Nz7pWKYKYLtodBozWb6jACc"
        />
      </head>
      <PagefindProvider>
        <body
          className={`font-sans min-h-screen bg-zinc-900 antialiased text-zinc-300 font-normal text-sm`}
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
