/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Post, posts } from "@/data/posts";
import puppeteer from "puppeteer";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "fs";
import path from "path";

const BlogOgImage: React.FC<{ post: Post; avatar: string }> = ({
  post,
  avatar,
}) => {
  return (
    <html style={{ height: "100%" }}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap');
            * {
              box-sizing: border-box;
            }
          `,
          }}
        />
      </head>
      <body
        style={{
          ["--zinc-100" as string]: "#f4f4f5",
          ["--zinc-900" as string]: "#18181b",
          margin: 0,
          overflowWrap: "anywhere",
          wordBreak: "normal",
          lineBreak: "strict",
          backgroundColor: "var(--zinc-100)",
          color: "var(--zinc-100)",
          fontFamily: "Noto Sans JP",
          padding: "36px",
          display: "flex",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            backgroundColor: "var(--zinc-900)",
            borderRadius: "16px",
            padding: "36px",
            flexDirection: "column",
            gap: "36px",
            boxShadow:
              "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "24px", alignItems: "start" }}>
            <img
              src={`data:image/png;base64,${avatar}`}
              alt="アバター"
              style={{ width: "80px", height: "80px" }}
            />
            <div style={{ fontWeight: "bold", fontSize: "36px" }}>hwld</div>
          </div>
          <div
            style={{ fontWeight: "bold", fontSize: "50px", overflow: "hidden" }}
          >
            {post.title}
          </div>
        </div>
      </body>
    </html>
  );
};

const generate = async ({ post, avatar }: { post: Post; avatar: string }) => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });

  const markup = renderToStaticMarkup(
    <BlogOgImage post={post} avatar={avatar} />
  );
  const fullHtml = `<!DOCTYPE html>${markup}`;
  await page.setContent(fullHtml, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.screenshot({ path: `./public/images/ogp/${post.slug}.png` });

  await browser.close();
};

const main = async () => {
  const avatar = readFileSync(
    path.join(__dirname, "../public/avatar.png")
  ).toString("base64");

  Promise.all(posts.map((p) => generate({ post: p, avatar })));
};

main();
