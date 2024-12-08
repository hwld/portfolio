JavaScriptの非同期処理を調べていると、度々イベントループという用語を目にします。
なんとなく概要は知っていても、具体的に何が行われているのかといった仕組みを詳細に理解しているとは言い切れませんでした。
そもそもJavaScriptがどのように実行されているかもあやふやです。

気になって調べていると、[イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理](https://zenn.dev/estra/books/js-async-promise-chain-event-loop)という記事を見つけました。この記事は非同期処理を理解するために最初にイベントループを学びます。
この部分ではイベントループだけではなくJavaScriptの実行環境や実行のメカニズムなども解説されていて、とても参考になりました。

この投稿は、そちらの記事のJavaScriptの実行メカニズムからイベントループまでを自分の理解のためにまとめたものです。

## JavaScriptの実行環境

「JavaScriptはシングルスレッドで実行される」という文言がありますが、ブラウザやNode.jsなどのJavaScritpの実行環境全体で見たときにはシングルスレッドではありません。
シングルスレッドで実行されている部分は、**JavaScriptエンジン**によるJavaScriptの実行であり、
JavaScriptの実行環境の中にはそれ以外のプログラムも存在します。ここではそれらをJavaScriptエンジンの外部にあるという意味で**外部環境**と呼びます。
JavaScriptの実行環境はホスト環境とも呼ばれます。

**JavaScriptエンジン**はJavaScriptを実行するプログラムで、一般的には**ECMAScript**を実装しています。
ChromeやNode.jsではV8と呼ばれるものが使用されており、これはJavaScriptの言語仕様である**ECMAScript**を実装しています。
広く利用されているJavaScriptエンジンは一般的にECMAScriptを実装しており、ECMAScriptで定義された機能を使用することができます。

JavaScriptでは、ECMAScriptによって定義されていない機能も一般的に使用されます。
よく使われるものとしては`console.log`や`fetch`、`setTimeout`などがあります。
多くの実行環境で同じ名前でAPIが提供されていることが多いのですが、ECMAScriptでは定義されておらず、外部環境に固有のものになっています。

> [!info]
> `fetch`はJavaScriptの言語仕様であるECMAScriptには定義されていませんが、Web標準(Web standards)と呼ばれる仕様では[定義されています](https://fetch.spec.whatwg.org/#fetch-method)。
Web標準は様々な団体によって策定される、Webの仕組みを定義する複数の標準と仕様です。
>
> このWeb標準では、`fetch`の他にもHTMLやCSSなどの仕様があります。

**外部環境** (造語) とは、JavaScript実行環境のうちJavaScriptエンジンではないものです。
外部環境ではECMAScriptでは定義されていないAPIが提供されていたり、イベントループがあります。
例えば実行環境であるNode.jsでは、外部環境でファイルI/Oが提供されていますが、これはマルチスレッドで実装されています。
特にブラウザでは外部環境が提供するAPIをWeb APIと呼びますが、外部環境によって提供されるAPIの総称がなさそうだったので、
ここでは**外部環境API**と呼びます。

## 実行コンテキストとコールスタック

## タスクとマイクロタスク

## イベントループ

![イベントループ](/images/js-event-loop.png)

## Promise

## 参考資料

- [イベントループとプロミスチェーンで学ぶJavaScriptの非同期処理](https://zenn.dev/estra/books/js-async-promise-chain-event-loop)
- [PromiseのUnhandled Rejectionを完全に理解する](https://zenn.dev/uhyo/articles/unhandled-rejection-understanding)
