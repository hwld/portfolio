Webフロントエンドのパフォーマンスを最適化するためには、ブラウザがWebページを表示する仕組みの理解が重要です。
HTMLやCSSなどを画面に表示するまでの流れを**クリティカルレンダリングパス**と呼び、最適化することでレンダリングのパフォーマンスを向上させることができます。
最適化のために、各ステップでどのような処理を行っているのか理解する必要があります。

この投稿は、ブラウザがWebページを表示する流れを自分の理解のためにまとめたものです。

## クリティカルレンダリングパス

**クリティカルレンダリングパス**とは、HTMLやCSS、JavaScriptを画面上のピクセルに変換して表示する一連の処理です。
クリティカルレンダリングパスには以下のステップが存在します。

1. DOMの構築
1. CSSOMの構築
1. スタイル (レンダーツリーの構築)
1. レイアウト
1. ペイント

DOMの構築やCSSOMの構築を**パース処理**といい、それ以降の処理を**レンダリング**と呼びます。

クリティカルレンダリングパスに含まれるステップは、ブラウザのメインスレッドで行われるものが多いです。
クリティカルレンダリングパスに時間がかかると、JavaScriptが実行されるメインスレッドがブロックされるため、応答性が悪くなってしまいます。

以下はクリティカルレンダリングパスの概要を表す図です。

![概要](/images/rendering-overview.png)

JavaScriptの実行というのは、DOMやCSSOMを変更するJavaScriptのプログラムの実行を表しています。
クリティカルレンダリングパスのステップには含まれていませんが、DOM構築中にHTMLにスクリプトタグが存在する場合やイベントの処理で実行されることがあります。

> [!info]
> ここではDOMやCSSOMという用語をDOM TreeやCSSOM Treeと呼ばれるデータ構造として使用しています。
場合によってはDOMやCSSOMはブラウザが提供するAPIのことを指すこともあるため、注意が必要です。

### 1. DOMの構築

DOMの構築は、受け取ったHTMLから**DOM**(Document Object Model)と呼ばれるデータを構築するステップで、**HTMLのパース処理**です。
DOMとはHTMLやXML文書を表す内部的なデータであり、プログラムからアクセスして操作することができます。
ブラウザはWebサーバーなどからHTMLを受け取ると、それを解析してDOMを構築していきます。

DOMにはスタイルの情報は無く、スタイルを担うデータは後述するCSSOMです。

DOMの構築は段階的に行うことができるため、部分的なHTMLからもDOMを構築することができます。
ブラウザはHTMLをストリーミング方式で処理するため、部分的なデータが渡されることがあります。
DOMの構築は段階的に行うことができるため、HTMLの断片を受け取るとすぐにDOMの構築を開始することができます。

DOMの例としては、以下のようなHTMLで、

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link href="style.css" rel="stylesheet" />
    <title>Critical Path</title>
  </head>
  <body>
    <p>Hello, <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg" /></div>
  </body>
</html>
```

以下のようなDOMが構築されます。

![DOM](/images/rendering-dom.png)

#### リソースの読み込み

DOM構築のためのHTML解析中にリソースを検出すると、それらの読み込みを行います。
リソースの例としては画像やフォント、CSSやJavaScriptなどがあります。

それらのリソースの中には、**ブロックリソース**と呼ばれる、クリティカルレンダリングパスをブロックするリソースがあります。
ブロックリソースは、レンダリング (後述する3以降の処理) をブロックする**レンダーブロックリソース**、HTMLのパースをブロックする**パーサーブロックリソース**があります。
画像やフォントなどのリソースはブロックリソースではなく、これらの読み込みは待機されません。

**レンダーブロックリソース**としては、`<link rel="stylesheet>"`のうち`disable`属性やデバイス固有の`media`属性がないものなどが挙げられます。
パーサーがこのリソースを検出すると、CSSを読み込んで後述するCSSOMを構築するまでレンダリングを待機させます。
一方で、CSSの読み込みによってHTMLパーサーはブロックされず、並行して残りのHTMLをパースしてDOMを構築することができます。
DOMとCSSOMが揃ったタイミングでレンダリングが実行されます。

CSSが基本的にレンダーブロックリソースになるのは、**FOUC** (Flash of Unstyled Content)と呼ばれる、
スタイルが適用されていないページが一瞬表示される現象を防ぐためです。
CSSがレンダーブロックリソースではないというのは、CSSが読み込まれてCSSOMが構築される前に、スタイル情報のないDOMだけを使用して画面が描画される可能性があるということです。

**パーサーブロックリソース**としては、`<script>`タグのうち`defer`属性や`async`属性、`type="module"`をもたないものなどが挙げられます。
こちらはレンダーブロックリソースと違い、リソースの読み込みによってHTMLパーサーがブロックされます。
リソースが読み込まれるとスクリプトが実行され、完了を待ってからパーサーが再びDOMの構築を行います。

JavaScriptが基本的にパーサーブロックリソースになるのは、JavaScriptがDOMやCSSOMを変更できるからです。
なぜDOMやCSSOMを変更できるとパーサーブロックリソースにする必要があるのかについて正確な情報は見つけられなかったのですが、
ChatGPTに聞くと「HTMLの整合性と予測可能な解析順序を維持するため」という回答が得られました。

パースブロックリソースは実質的にレンダリングブロックリソースでもあります。
クリティカルレンダリングパスは、パースのあとにレンダリングが実行されるため、
パースがブロックされるということはレンダリングもブロックされていると言えます。

`<script>`タグでは、`defer`属性や`async`属性、`type=module"`を使用するとスクリプトの読み込みに限ってはパーサーをブロックしないようになります。
`defer`属性をつけるとDOM構築後の`DOMContentLoaded`イベントの直前にスクリプトが実行され、
`async`属性をつけると非同期でスクリプトが読み込まれ、読み込みが完了するとすぐにスクリプトを実行します。
`type="module"`は`defer`属性と似た挙動で、`type="module"`と`async`属性を使用すると、`async`属性と似た挙動になります。

`defer`属性はDOM構築後の`DOMContentLoaded`イベントの直前にスクリプトが実行されるため、スクリプト実行でHTMLパーサーをブロックすることはないのですが、
`async`属性はスクリプトを読み込み終わったらすぐにスクリプトを実行するため、DOM構築中にはHTMLパーサーを中断させる可能性があります。

パーサーブロックリソースの問題は、**プリロードスキャナ**と呼ばれるセカンダリHTMLパーサで軽減することができます。
プリロードスキャナは、メインのHTMLパーサーと並行して動作して、検出したリソースをその場で読み込みます。
メインのHTMLパーサーがJavaScriptの処理などによってブロックされている間に、その先に存在するリソースを検出して読み込むことができます。
これによって、次にメインのHTMLパーサーがリソースに到達した時点で読み込みが完了している可能性が高くなります。
ただ、プリロードスキャナはJavaScriptを実行しないため、例えば動的に挿入されたスクリプトタグなどを検出することはできません。

### 2. CSSOMの構築

CSSOMの構築は、

### 3. スタイル

スタイルは、

### 4. レイアウト

レイアウトは、

### 5. ペイント

ペイントは、

## JavaScriptがトリガーのレンダリング

## さいごに

## 参考資料

- [ちいさなWebブラウザを作ろう](https://browserbook.shift-js.info/chapters/basic-concepts#fn-6)
- [Critical rendering path - MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path)
- [ページの生成: ブラウザーの動作の仕組み - MDN](https://developer.mozilla.org/ja/docs/Web/Performance/How_browsers_work)
- [クリティカル パスの把握 - web.dev](https://web.dev/learn/performance/understanding-the-critical-path?hl=ja)
- [リソースの読み込みを最適化する - web.dev](https://web.dev/learn/performance/optimize-resource-loading?hl=ja)
- [クリティカル レンダリング パス - web.dev](https://web.dev/articles/critical-rendering-path?hl=ja)
- [オブジェクト モデルの構築 - web.dev](https://web.dev/articles/critical-rendering-path/constructing-the-object-model?hl=ja)
- [レンダリング ブロック CSS - web.dev](https://web.dev/articles/critical-rendering-path/render-blocking-css?hl=ja)
- [JavaScript によるインタラクティビティの追加 - web.dev](https://web.dev/articles/critical-rendering-path/adding-interactivity-with-javascript?hl=ja)
- [レンダリング ツリーの構築、レイアウト、ペイント - web.dev](https://web.dev/articles/critical-rendering-path/render-tree-construction?hl=ja)
- [ブラウザのプリロード スキャナに対抗しない - web.dev](https://web.dev/articles/preload-scanner?hl=ja)
- [RenderingNG - Chromium](https://developer.chrome.com/docs/chromium/renderingng?hl=ja)
- [レンダリング ブロック リソースを排除する - Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources?hl=ja)
- [スクリプト: async, defer - JAVASCRIPT.INFO](https://ja.javascript.info/script-async-defer)
