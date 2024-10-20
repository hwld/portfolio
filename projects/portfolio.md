## 使用した技術と実装の詳細

- TypeScript
- Next.js (Static Exports)
- Firebase Hosting

### ページ生成

プロジェクトの詳細やブログはMarkdownで書いて、React Server Componentを使用してビルド時にHTMLに変換してページにしています。
プロジェクトやブログのデータはTypeScriptの配列として持っており、ビルド時にMarkdownファイルが存在しない場合にはエラーで落とし、
Markdownが存在しなかったり、存在しないプロジェクトのMarkdownを作ってしまわないようにしています。

### コードハイライト

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

また、コードをコピーするボタンも実装しました。

### ToC (目次)

プロジェクト詳細やブログにはToCを表示しています。
Tocbotというライブラリがあるのですが、ビルド時にレンダリングできず、ちらつきが発生してしまうため、[mdast-util-toc](https://github.com/syntax-tree/mdast-util-toc/tree/main)を使って簡単なremarkプラグインを実装しています。

ただToCを表示するだけならそこまで難しくはないのですが、スクロール位置やURLフラグメントに応じて目次のリンクをアクティブにする実装が大変でした。
最終的には、`IntersectionObserver`でh要素を監視して、スクロールされているときに対応するリンクをアクティブにするような実装にしています。
また、下から上にスクロールしたときに、一つ前の見出しへのリンクをアクティブにするために、h要素に一つ前のidを持たせるrehypeプラグインを実装しています。

このように自作してReact Server Componentとして実装しているので、ビルド時にToCがレンダリングされ、ちらつきがなくなっています。

### ナビゲーションバー

下部にあるナビゲーションバーのアニメーションにもこだわっており、実装するのが難しかったです。
vercelのdashboardにあるナビゲーションバーを触っていて楽しいと感じたので、真似しました。
もともとはframer-motionの[Layout Animations](https://www.framer.com/motion/layout-animations/)
という機能を使っていたのですが、モバイルでスクロールしているときの挙動がおかしかったので、
`onPointerEnter`を使用してDOMの情報を取得し、それを使ってレンダリングしています。  

ブログのページが増えたので画面幅が小さいと画面に収まらなくなりUIを変えてしまったため、
今はモバイルだとこのアニメーションは見れないのですが、モバイルのナビゲーションバーにもこだわっています。
