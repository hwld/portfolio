---
title: portfolio
createdAt: 2024-03-05
tags: []
imageSrc: /screenshots/portfolio.png
summary: このポートフォリオです。
projectUrl: /
githubUrl: https://github.com/hwld/portfolio
---

## 使用した技術と実装の詳細

- TypeScript
- Next.js (Static Exports)
- Firebase Hosting

### ページ生成

プロジェクトの詳細やブログはMarkdownで書いて、RSC (React Server Component) を使用してビルド時にHTMLに変換してページにしています。
プロジェクトやブログのデータはTypeScriptの配列として持っており、ビルド時にMarkdownファイルが存在しない場合にはエラーで落とし、
Markdownが存在しなかったり、存在しないプロジェクトのMarkdownを作ってしまわないようにしています。

### ページ検索

このプロジェクトではページ検索も実装しています。
このプロジェクトは大部分がRSCを使用してビルド時にHTMLに変換しているため、
静的サイト向けの検索ライブラリである[Pagefind](https://pagefind.app/)が使えます。
開発環境と本番環境で使い分けるためにビルド時に2回Pagefindコマンドを実行しているのですが、もうちょっとどうにかしたいです。

デスクトップのUIではナビゲーションバー横の検索ボタンから検索のためのパネルを表示して検索できるようにしています。
[cmdk](https://cmdk.paco.me/)を使用しているので、キーボードだけで検索結果にフォーカスを当ててページに遷移することもできます。
一方、モバイル環境では画面下部の検索バーは使いにくいため、検索ボタンから検索ページに遷移するようにしています。
(全角アルファベットで検索するとエラーが出てしまいますが、対処法がわからないためそのままにしています・・・)

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

ToCの実装を簡単にするために、Markdownの見出し要素を`section`でラップする
[rehype-sectionize](https://github.com/hbsnow/rehype-sectionize)というプラグインを使用しています。
このプラグインを使用することで、`IntersectionObserver`で`section`を監視するだけでスクロール位置に応じた目次のリンクをアクティブにできます。
見出し要素を`section`でラップしないと、上にスクロールしたときに本文に対応する見出し要素のリンクをアクティブにするのが難しかったです。

このように自作してRSCとして実装しているので、ビルド時にToCがレンダリングされ、ちらつきがなくなっています。

### ナビゲーションバー

下部にあるナビゲーションバーのアニメーションにもこだわっており、実装するのが難しかったです。
vercelのdashboardにあるナビゲーションバーを触っていて楽しいと感じたので、真似しました。
もともとはframer-motionの[Layout Animations](https://www.framer.com/motion/layout-animations/)
という機能を使っていたのですが、モバイルでスクロールしているときの挙動がおかしかったので、
`onPointerEnter`を使用してDOMの情報を取得し、それを使ってレンダリングしています。  

ブログのページが増えたので画面幅が小さいと画面に収まらなくなりUIを変えてしまったため、
今はモバイルだとこのアニメーションは見れないのですが、モバイルのナビゲーションバーにもこだわっています。

ナビゲーションバーは画面下部の中央に表示しているのですが、スクロールバーの有無によってズレてしまうことがありました。
例えば検索ページでは、検索していないときにはスクロールバーは表示されず、検索結果が多いとスクロールバーが表示されるのですが、
そういったときにナビゲーションバーがズレてしまいます。

ページのコンテンツのズレは`scrollbar-gutter`プロパティを使用することで防げるのですが、
ナビゲーションバーは`left: 50%`のように指定しているとズレてしまいます。
スクロールバーを含まない幅を基準にしているのが原因だと思うのですが、代わりに`vw`を使うことでズレが無くせます。
`vw`はビューポートに対する幅を表す単位で、ビューポートにはスクロールバーも含まれ、
`scrollbar-gutter`を使用していると常にスクロールバーの幅が確保されているので、中央に配置することができます。

### ブログのOGP画像を生成

ブログの各記事に以下のようなOGP画像を設定しています。

![OGP画像のサンプル](/images/ogp/o11y.png)

この画像はプロジェクトのビルド時にPuppeteerを使用して生成しています。
バックエンドを使用してリクエスト時に画像を生成する方法もあるのですが、ブログ記事は静的に生成しているため、ビルド時に画像を生成する方が効率が良いと思います。
ビルド時に生成するためにはcanvasを使った方法やPuppeteerやPlaywrightを使用する方法などがあります。
今回はReactコンポーネントを手軽に画像にできるという理由でPuppeteerを使っています。
Playwrightも同じように使えるのですが、CI上でブラウザをインストールする必要があり時間がかかってしまいます。

PuppeteerではHTMLをセットしてスクリーンショットを取る機能があるため、それを使用しています。ReactでOGP画像のためのコンポーネントを作成し、`renderToStaticMarkup`でHTMLに変換したあとに、Puppeteerにセットしてスクリーンショットを取っています。

ブログ記事以外では設定していないのですが、そのうち作るかもしれません。
