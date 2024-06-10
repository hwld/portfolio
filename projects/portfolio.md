## 使用した技術と実装の詳細

- TypeScript
- Next.js (Static Exports)
- Firebase Hosting

プロジェクト詳細はMarkdownで書いて、ビルド時にhtmlに変換してページにしています。  
Markdownのファイル名から、`/projects/[fileName]`というページを生成しています。  
プロジェクトのデータはTypeScriptの配列として持っており、ビルド時にMarkdownファイルが存在しない場合にはエラーで落とし、Markdownが存在しなかったり、存在しないプロジェクトのMarkdownを作ってしまわないようにしています。

ページ内のコードブロックは、[shiki](https://shiki.style/)を使用して構文ハイライトを効かせています。  
初めはMarkdownの表示にreact-markdownを使用していたのですが、shikiのプラグインを使用することができなかったので、
unified/remark/rehypeなどを使用してJSXに変換しています。  

```ts
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShiki, { theme: "nord" });

const mdast = processor.parse(markdown);
const hast = await processor.run(mdast, markdown);
const jsx = toJsxRuntime(hast, {/* ... */});
```

のようなコードになっています。  
コードをコピーするボタンも実装しました。

あとは下部にあるナビゲーションバーのアニメーションにこだわっています。  
vercelのdashboardにあるナビゲーションバーを触っていて楽しいと感じたので、真似しました。
もともとはframer-motionの[Layout Animations](https://www.framer.com/motion/layout-animations/)
という機能を使っていたのですが、モバイルでスクロールしているときの挙動がおかしかったので、
`onPointerEnter`を使用してDOMの情報を取得し、それを使ってレンダリングしています。  
