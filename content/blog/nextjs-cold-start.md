---
title: Next.js コールドスタート問題の調査記録
createdAt: 2024-11-06
---

Next.jsで作った[aluep](/projects/aluep)というWebアプリをCloud Runにデプロイしていたのですが、
リクエストがコールドスタート時に遅くなるという問題がありました。
Cloud Runはコールドスタートが発生するため時間がかかるとは言われていますが、
メトリクスを見るとコンテナ起動のレイテンシは約1秒、ページのレスポンスには5 ~ 7秒かかっていました。

この投稿は、どうにかしてCloud Runで時間がかかっていそうな処理を見つけ、改善するまでの記録です。
今後似たような調査を行うときに、どれか一つでも役に立つことを願って、やってきたことや関連する情報について詳細に書いてきます。

長くなってしまうので、最初に調査の概要と結果について書きます。

## 調査の概要と結果

調査した環境は以下のとおりです。

- Cloud Run (+[CPUブースト](https://cloud.google.com/run/docs/configuring/cpu?hl=ja&_gl=1*bw91h3*_ga*MTI0NTcwNzE1MS4xNzI2OTYwMjQ1*_ga_WH2QY8WWF5*MTczMDc1MjY0MC41NC4xLjE3MzA3NTQ0MjAuNjAuMC4w#startup-boost))
- Next.js v14.2.6 Pages Router
- React v18.2.0
- [Mantine](https://mantine.dev/) v7.13.4

[Automatic Static Optimization](https://nextjs.org/docs/14/pages/building-your-application/rendering/automatic-static-optimization)
が適用されたページにリクエストを送ると、レスポンスに5 ~ 7秒かかってしまう原因について調査しました。
コールドスタート時のコンテナ起動のレイテンシが約1秒あるとしても、バックエンド側で処理があまり必要がないと考えていたため、ここまで時間がかかる原因がわかりませんでした。

結果は、`_document.tsx`にあるMantineからの`import`によって、大量のMantineのモジュール解決が発生していることが原因でした。
`import`を削除することで、ホーム画面のレスポンスが 5 ~ 7秒 から 1 ~ 3秒 まで改善しました。

## 調査の記録

Next.jsのコールドスタート問題を調べている際、Next.jsのGitHub Discussionsにあった[コメント](https://github.com/vercel/next.js/discussions/12447#discussioncomment-4979883)をきっかけに詳細な調査を開始しました。
そのコメントでは、Next.jsの内部でページを読み込むために使用されている`requirePage`という関数に時間がかかっているとありました。
これを見たとき、どうやって調査しているんだろう？と思い、自分でも試したくなりました。

調査は、準備をしたり計画を立てるなどのことはせず、場当たり的に行っていました。
コードやログや設定を行ったり来たりしながら調査を行っていたのですが、わかりやすくするために順番を整理してまとめています。

### Next.jsのコードを読む

まずはNext.jsにリクエストがあったときに具体的にどのような処理が行われているかを把握するために、Next.jsのコードを読みました。
Pages Routerを前提としてコードを読んでいます。

対象のアプリはstandaloneモードで実行しており、サーバーの起動にはビルドして生成される `.next/standalone/server.js` を使用します。
このコードの内部で、 `server/lib/start-server.ts` にある`startServer`関数を呼んでいたので、まずはこのコードを読みました。

`startServer`には[リクエストハンドラを初期化するコード](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/lib/start-server.ts#L293-L304)があり、`router-server.ts`の[initialize関数](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/lib/router-server.ts#L64-L65)
がリクエストハンドラを作成して返します。
`initialize`関数で返されるリクエストハンドラの内部では、`render-server.ts`の[initialize関数](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/lib/render-server.ts#L119-L120)
が呼ばれ、`initialize`関数は[NextServerクラス](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next.ts#L59)を返す`next.ts`の[createServer関数](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next.ts#L354)をさらに呼び出し、[NextServer.getRequestHandler](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next.ts#L82)で実際のリクエストハンドラを取得します。
`NextServer.getRequestHandler`関数は、更に様々な関数を呼び出して、最終的には[NextNodeServer.handleCatchallRenderRequest関数](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next-server.ts#L932-L933)を呼ぶリクエストハンドラが返されます。

リクエストハンドラを作成するフェーズと、リクエストを実際に処理するフェーズが混ざっているのでわかりにくいのですが、コードを追っていった順番は以下のようになります。

- `start-server.ts`の`startServer`関数
- `router-server.ts`の`initialize`関数
- `render-server.ts`の`initialize`関数
- `next.ts`の`createServer`関数
- `next.ts`の`NextServer.getRequestHandler`関数
- ...
- `next-server.ts`の`NextNodeServer.handleCatchallRenderRequest`関数

リクエストがあると、最終的に`NextServer.handleCatchallRenderRequest`関数が呼ばれ、
[APIリクエスト](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next-server.ts#L1004)と[ページコンポーネント](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next-server.ts#L1008)のリクエストの分岐があるように見えました。

> [!note]
> ちなみに、App Routerの[Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)は、
> ページコンポーネントの分岐に進み、コンポーネントと同じように処理されます。Route Handlersはビルドで生成されるjsファイルの`routeModule`に、実際のハンドラの関数を持つ[AppRouteRouteModuleクラス](https://github.com/vercel/next.js/blob/2f43ba59e54cc45630638d1e1632ec81ee05b8f0/packages/next/src/server/route-modules/app-route/module.ts#L160)
> を埋め込みます。
> そして、`Server.renderToResponseWithComponentsImpl`関数のなかに、
> Pages Routerコンポーネント、App Routerコンポーネント、Route Handlersで分岐があり、Route Handlersの場合は、
[AppRouteRouteModule.handle関数が呼ばれます。](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/base-server.ts#L2235)

ここまでで、実際にリクエストがあったときに実行されていそうなパスのコードを見ていきました。
ただ、重要そうな箇所しか読んでいなかったので、実際に実行されるコードは異なっている可能性がありますし、所要時間もわかりません。

そこで、実行パスを可視化できないかを考えていました。

### 実行パスを可視化する

#### debug関数

Next.jsのコードを読んでいるとき、`debug`関数が呼ばれている部分がいくつかありました。
例えば、`router-server.ts`のコードの中には、以下のようなコードが存在します。

```ts
import setupDebug from 'next/dist/compiled/debug'
// ...
const debug = setupDebug('next:router-server:main')
// ...
debug('invokeRender', req.url, req.headers)
```

なんとなくデバッグ時に情報を出力するための関数だと思ったので、どうにかしてこれを表示できないかを調べました。
debugの実態は[ここ](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/compiled/debug/index.js#L1)にあるのですが、コンパイル(?)されており、読めたものではありません。
何も考えずにChatGPTに投げてみたところ、`setupDebug`に渡している文字列を`DEBUG`環境変数に設定すると表示できそうでした。

環境変数を設定してみると、うまく表示されました。
ホーム画面へのリクエストを投げてみると、`invokeRender '/' ...`のようなログが表示されます。
これによって、リクエスト時に`invokeRender`関数が実行されることがわかります。`invokeRender`関数は、
内部で`render-server.ts`の`initialize関数`を呼び、取得したリクエストハンドラを実行します。

<https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/lib/router-server.ts#L216-L289>

```ts
// 抜粋
async function invokeRender() {
  debug('invokeRender', req.url, req.headers)

  const initResult = await renderServer?.instance?.initialize(
    renderServerOpts
  )
  await initResult?.requestHandler(req, res)
  return
}
```

これまで読んできたコードの少なくとも最初の部分については実行されていると確認できました。
`invokeRender`のログのあとに数秒経過していることから、この処理に時間がかかっていることもわかります。

しかし、改善のためには情報が不足しています。
問題を改善するためには、ユーザーが実装しているコードのどの部分に時間がかかっているのかを把握する必要があります。

#### Sentry Tracing

Next.jsのコードでは、`debug`関数よりも高い頻度で`getTracer`関数というものが使われています。
これは[NextTraceImpl](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/lib/trace/tracer.ts#L161)クラスを作成する関数で、このクラスは[OpenTelemetry](https://opentelemetry.io/ja/)というフレームワークを使用して実装されています。

OpenTelemetry (OTel) は、オブザーバビリティのためのフレームワークのことで、トレース・メトリクス・ログといったテレメトリデータを作成・収集するためのものです。
オープンスタンダードで様々なベンダーによってサポートされているため、ベンダーに依存せずにオブザーバビリティを向上させることができます。

OTelには主要なモジュールとしてAPIとSDKがあり、APIはインターフェースのようなもので、SDKは実装です。
これらを分離することで、ライブラリはAPIに依存するだけで異なるSDKをサポートすることができます。
Node.jsのOTelの実装では、API/SDKの分離をシングルトンやグローバル変数を利用して実現しています。
API側でシングルトンやグローバル変数を提供し、SDK側でAPIのシングルトンに実装を登録して、
テレメトリデータを作成・収集できるようにしています。

`NextTraceImpl`の実装を見てみると、`@opentelemetry/api`からimportされたモジュールを使用しています。
Next.jsは[OtelのSDKを使用する方法](https://nextjs.org/docs/14/pages/building-your-application/optimizing/open-telemetry)も提供しており、
ユーザーがSDKを直接使用したり、ラップされているモジュールを使用できます。

どの処理に時間がかかっているのかを知るために必要なテレメトリデータは[トレース](https://opentelemetry.io/ja/docs/concepts/signals/traces/)です。
トレースはコードがどのように実行されているかを把握するのに有用で、[スパン](https://opentelemetry.io/ja/docs/concepts/signals/traces/#spans)というデータで表現されます。スパンは階層構造を持っており親子関係を表現できるので、処理がどの処理から呼び出されているかが明確になります。
また、実行時間の内訳を把握しやすく、どの処理にどれだけの時間がかかっているのかも簡単に把握できます。
分散システムで特に効果を発揮しますが、それ以外でも処理の流れを掴みやすくなると思います。

Next.jsで簡単にトレース情報を取得できる方法がないかなあと調べていると、[Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/)というサービスを見つけました。コマンド一つで良い感じにセットアップしてくれるので、簡単にトレース情報の収集が行えました。

トレースを見てみると、Next.jsの`resolve page components`に約4秒ほどかかっていることがわかりました。
このトレースは、[findPageComponents](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next-server.ts#L689)の実行を表しています。これは`handleCatchallRenderRequest`関数の中の`render`関数から最終的に呼ばれる関数で、
コンポーネントのロードなどを行います。

<https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next-server.ts#L726-L798>

```ts
// 抜粋
private async findPageComponentsImpl() {
    const components = await loadComponents({
      distDir: this.distDir,
      page: pagePath,
    })

    return {
      components,
    }
}
```

Next.jsでは`NEXT_OTEL_VERBOSE=1`を設定することで、より詳細なトレースを取得することができますが、Sentryではうまくいきませんでした。
デバッグ情報を出力するとトレースは取得されているようなのですが、Sentryのダッシュボードでは確認できませんでした。
この情報から、`findPageComponents`、`loadComponents`、 `renderToResponseWithComponents`の順に実行されていることはわかりましたが、所要時間はわかりません。

`debug`関数でのログとトレース情報によって、`invokeRender`の中で実行される`findPageComponents`に時間がかかることは確認できました。
このことから、どうやらコンポーネントのロードに時間がかかっていそうだということはわかりますが、まだ情報は足りません。

#### v8 profiler

これまで試してきた`debug`関数や`getTracer`関数は、あらかじめ意図して設定した箇所の情報が記録されますが、十分な情報が得られませんでした。
そういったとき、プロファイリングを行うことで、アプリケーション全体の情報を網羅的に取得することができます。

Node.jsでは、[v8のprofiler](https://v8.dev/docs/profile)を使用することでプロファイリングを行うことができます。
最も簡単な方法は、`node --prof`でプログラムを実行する方法です。`--prof`オプションを付けるとプロファイルが保存され、
それを`node --prof-process`に渡すと、時間がかかっている処理の言語や関数のランキングなどが表示されます。
ここで出力されるものは概要であり、すべての情報が表示されるわけではないため、まだ情報が足りないです。
そこで、フレームグラフを作成することで網羅的な情報を確認することができます。

[フレームグラフ](https://www.brendangregg.com/flamegraphs.html)は関数の所要時間などが視覚化されたグラフのことで、プロファイリングツールで作成することができます。
Node.jsだと[0x](https://github.com/davidmarkclements/0x)や[pprof-nodejs](https://github.com/google/pprof-nodejs)などがあり、
どちらも内部的にはv8のprofilerを使用しています。

これらを使用することで各関数の所要時間が確認できると思ったのですが、どうすればCloud Runで使用できるのかがわかりませんでした。
そこで、Google Cloudが提供している[Cloud Profiler](https://cloud.google.com/profiler/docs/about-profiler?hl=ja)を使用してみました。
サポートされている構成のなかにCloud Runはなかったのですが、Cloud Runでも使えるという情報を目にしたので試しました。
ちなみにCloud Profilerは内部でpprof-nodejsが使われていそうでした。

Cloud Profilerを試してみたところ、プロファイリングは行われているのですが、あまり正確ではありませんでした。
そもそもこれはサンプリングプロファイラなため、特定のリクエストのプロファイリングは難しいのだと思います。

Sentryにもトレースの他に[Profiling](https://docs.sentry.io/product/explore/profiling/)の機能があるみたいだったので試してみました。
こちらはリクエストごとにトレースが表示できるようでしたが、所要時間が正確ではないように見えました。長時間かかっているリクエストも短く表示されてしまいました。

コールドスタート後のリクエストのフレームグラフを作成したかったのですが、正確に作成できる方法を見つけることができませんでした。
これができないとなると、Next.jsの内部にログを埋め込む方法しか思いつきません。
幸い、これまでの調査で得た情報によって、ある程度のNext.jsの実行パスは頭の中にあります。

#### ログの埋め込み

Next.jsにログを埋め込むためには、node_modulesを書き換える必要がありますが、ビルド時に再インストールされるため、[patch-pacakge](https://github.com/ds300/patch-package)というツールを使用しました。
node_modulesを書き換えたあとに実行すると、`/patches`以下にパッチが作成され、`patch-package`コマンドでパッチを適用できるようになります。

これを使ってNext.jsの内部で時間のかかっていそうなコードにあたりをつけて`console.log`を追加していきます。
Dockerfileで依存関係をインストールする時点で`/patches`ディレクトリをコピーするのを忘れていてパッチが適用できていないという問題もありましたが、
簡単にログを埋め込むことができました。

主に以下のように`console.log`を追加していきました。

まずは、これまでの情報から時間がかかっていることがわかっている`findPageComponents`の中で、遅そうな`loadComponentsImpl`関数にログを追加しました。

<https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/load-components.ts#L125-L218>

```ts
// 抜粋
async function loadComponentsImpl() {
  console.log('Start requirePage _document and _app')
  // loadComponentsでは、_appと_documentのロードも行います
  ;[DocumentMod, AppMod] = await Promise.all([
    Promise.resolve().then(() => requirePage('/_document', distDir, false)),
    Promise.resolve().then(() => requirePage('/_app', distDir, false)),
  ])
  console.log('End requirePage _document and _app')


  console.log('Start other of loadComponents')
  // ...
  console.log('End other of loadComponents')


  console.log(`Start requirePage ${page}`)
  // 実際のページコンポーネントのロード
  const ComponentMod = await Promise.resolve().then(() =>
    requirePage(page, distDir, isAppPath)
  )
  console.log(`End requirePage ${page}`)

  // ...
}
```

次に、この関数の内部で呼び出されている`requirePage`にも追加しました。
調査のきっかけになった[GitHubのコメント](https://github.com/vercel/next.js/discussions/12447#discussioncomment-4979883)にも、
ここに時間がかかっていると書かれていました。

<https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/require.ts#L108-L132>

```ts
// 抜粋
function requirePage(){
  const pagePath = getPagePath(page, distDir, undefined, isAppPath)
  if (pagePath.endsWith('.html')) {
    console.log(`Start readFile ${pagePath}`)
    // Automatic Static Optimizationが適用されている場合は、
    // htmlとして出力されたファイルを読み込み、requireは実行されない。
    return promises.readFile(pagePath, 'utf8').catch((err) => {
      throw new MissingStaticPage(page, err.message)
    })
  }

  console.log(`Start require ${pagePath}`)
  const mod = require(pagePath)
  console.log(`End require ${pagePath}`)

  return mod
}
```

実際には他にもログを埋め込んでいますが、重要なのはこのあたりです。
ホーム画面へのリクエストで、以下のようなログを想像していました。

```log
Start requirePage _document and _app
  Start require `_document.js`
  End   require `_document.js`
  Start require `_app.js`
  End   require `_app.js`
End   requirePage _document and _app
Start other of loadComponents
End   other of loadComponents
Start requirePage /
  Start readFile `index.html`
End   requirePage /
```

このようなログで、タイムスタンプによってどの処理に時間がかかっているのかを把握できると考えていました。
調査のきっかけになった[GitHubのコメント](https://github.com/vercel/next.js/discussions/12447#discussioncomment-4979883)では、
`requirePage`に時間がかかっているとあったので、`Start require ...`と`End require ...`のタイムスタンプに開きがあることを期待していました。

実際にホーム画面をリクエストしたときのログは以下のような感じでした。
同じログが複数あるため、どこから発生したログかわかりやすいように数字を書きました。
また、時間がかかっているログに`[WARNING]`とつけています。

```log
※ タイムスタンプは秒のみ表示

54: Start requirePage _document and _app (1)
54: Start requirePage _document and _app (2)
54:   Start require `_document.js` (1)
54:   End   require `_document.js` (1)
54:   Start require `_app.js` (1)
54:   End   require `_app.js` (1)
54:   Start require `_document.js` (2)
54:   End   require `_document.js` (2)
54:   Start require `_app.js` (2)
54:   End   require `_app.js` (2)
54: Start requirePage _document and _app (3)
54:   Start require `_document.js` (3)
54:   End   require `_document.js` (3)
54:   Start require `_app.js` (3)
54:   End   require `_app.js` (3)             [WARNING]
58: End   requirePage _document and _app (1)  [WARNING]
58: Start other of loadComponents (1)
58: End   requirePage _document and _app (2)
58: Start other of loadComponents (2)
58: End   requirePage _document and _app (3)
58: Start other of loadComponents (3)
...
```

`Start require ...`と`Start require ...`の間にはそこまで時間がかかっていなく、よくわからない箇所に4秒も時間がかかっています。
また、`Start requirePage _document and _app`と後続の処理が、なぜか3回実行されています。

まずは、なぜ`_app`と`_document`のセットが3回も`require`されているのかを調査しました。
このログは`loadComponents`が3度呼ばれていることを表しています。
1つは実際にリクエストしているホーム画面のコンポーネントだと想定すると、あと2つの呼び出しがあります。
`loadComponents`を使っている場所を探したところ、以下のようなコードがありました。

<https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next-server.ts#L217-L228>

```ts
// 抜粋
class NextNodeServer extends BaseServer {
  constructor() {
    // ほとんどのリクエストで必要になるため、
    // 事前にウォームアップしておく
    loadComponents({
      distDir: this.distDir,
      page: '/_document',
      isAppPath: false,
    }).catch(() => {})

    loadComponents({
      distDir: this.distDir,
      page: '/_app',
      isAppPath: false,
    }).catch(() => {})
  }
}
```

`NextNodeServer`というのは、初回リクエスト時に作成されるクラスです。
具体的には、`render-server.ts`の`initialize`関数で作成される`NextServer`が保持しています。

上のコードでは、`loadComponents`を`_document`と`_app`で2回呼び出しているため、ログの内容と一致します。
それでも、`Start requirePage _document and _app`が連続していることに疑問を感じるかもしれません。
このログの直後に`requirePage`が実行されるのだと考えてしまうと、ログの順序がわからなくなります。
これを理解するためには、`Promise`の知識が必要になってきます。
まず、`requirePage`を呼び出しているコードは以下のようになります。

```ts
console.log('Start requirePage _document and _app')
;[DocumentMod, AppMod] = await Promise.all([
  Promise.resolve().then(() => requirePage('/_document', distDir, false)),
  Promise.resolve().then(() => requirePage('/_app', distDir, false)),
])
```

ここでは、`Promise.all`の中で直接`requirePage`を実行するのではなく、`then`のコールバックで実行しています。
`Promise`はすぐに`resolve`して`then`のコールバックが実行されるように見えるのですが、実際にはそうはなりません。
`Promise`はすぐに`reolve`されるのですが、[コールバックはマイクロタスクキューの最後尾に積まれます。](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/d-epasync-task-microtask-queues#%E3%83%9E%E3%82%A4%E3%82%AF%E3%83%AD%E3%82%BF%E3%82%B9%E3%82%AF%E3%82%AD%E3%83%A5%E3%83%BC:~:text=Promise%20%E3%81%AE%20then()%20%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%81%AA%E3%81%A9%E3%81%AE%E5%BC%95%E6%95%B0%E3%81%AB%E6%B8%A1%E3%81%99%E3%82%B3%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF%E9%96%A2%E6%95%B0%E3%81%8C%E3%83%9E%E3%82%A4%E3%82%AF%E3%83%AD%E3%82%BF%E3%82%B9%E3%82%AF%E3%81%A8%E3%81%97%E3%81%A6%E6%89%B1%E3%82%8F%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82)
マイクロタスクキューに積まれるため、`reqiurePage`は`Start require _document and _app`の直後には実行されていません。

これで`Start requirePage _document and _app`が3度も表示されてる理由はわかりましたが、
以下のログの間で4秒もの時間がかかっている理由はわかりませんでした。

```log
54:   End   require `_app.js` (3)             [WARNING]
58: End   requirePage _document and _app (1)  [WARNING]
```

このログに関連するコードを簡単に展開すると以下のようになります。

```ts
console.log('Start requirePage _document and _app')
;[DocumentMod, AppMod] = await Promise.all([
  // ...
  Promise.resolve().then(() => {
    console.log('Start require `_app.js`')
    const mod = require('_app.js')
    console.log('End require `_app.js`')
    return mod;
  }),
])
console.log('End requirePage _document and _app')
```

上の2つのログは、実際には異なる`loadComponents`の呼び出しなのですが、上のようなコードが実行されていると言えそうです。
そして、`await`は対象の`Promise`が`resolve`されると、`then`のように後続の処理を[マイクロタスクに積みます。](https://zenn.dev/estra/books/js-async-promise-chain-event-loop/viewer/15-epasync-v8-converting#await-%E5%BC%8F%E3%81%AF%E7%A2%BA%E5%AE%9F%E3%81%AB%E3%83%9E%E3%82%A4%E3%82%AF%E3%83%AD%E3%82%BF%E3%82%B9%E3%82%AF%E3%82%92%EF%BC%91%E3%81%A4%E7%99%BA%E8%A1%8C%E3%81%99%E3%82%8B)

コードだけを見ると、`End require _app.js`と`End requirePage _document and _page`の間には何も処理がないように見えますが、
`await`で実行フローが分割されているため、２つの処理は同期的に実行されているわけではありません。
とすると考えられるのは、`await`の後続の`End requirePage _document and _app`を含む処理がマイクロタスクキューに積まれる前に、4秒間実行されるマイクロタスクが積まれているのではないかということです。

それを探すためには、実行されているすべてのコードを読む必要があるように思えました。
これまでは必要そうな部分だけに着目することで、なんとかコードを読めていましたが、すべてのコードを読むとなるとNext.jsの内部構造の知識が足りません。

ここで、`requirePage`に時間がかかっているという[コメント](https://github.com/vercel/next.js/discussions/12447#discussioncomment-4979883)の通りになっていないように見えることが気になっていました。そのコメントでは、モジュールを読み込むのに時間がかかると書いてあります。
僕は`Start require ...`と`End require ...`の間でモジュールが読み込まれていると思い込んでいましたが、
実際にどんなモジュールが読み込まれているかはわかりませんし、もしかしたら別の場所で読み込まれているのかもしれません。

モジュールの読み込みに時間がかかると仮定すると、謎の4秒の間にモジュールの読み込みが実行されている可能性はあると考えました。

#### モジュール解決のデバッグログ

Node.jsでモジュールの読み込みを表示する方法を調べていると、`NODE_DEBUG`という環境変数に、`module,esm`という値を設定すると良いことがわかりました。
また、モジュールを読み込んで利用できるようにするプロセスのことをモジュール解決と呼ぶこともわかりました。

この環境変数を設定してみると、読み込まれているモジュールがすべて表示されるようになります。
ログの量がとんでもないことになるのですが、やはり以下のログの間に大量のモジュール解決のログが表示されていました。

```log
54:   End   require `_app.js` (3)             [WARNING]
58: End   requirePage _document and _app (1)  [WARNING]
```

ログをさらに遡ると、一番はじめの`Start require (_document.js | _app.js)`のあとにもモジュール解決のログは表示されていますが時間はかかっていません。
それ以降の`Start require (_document.js | _app.js)`では[キャッシュを使用している](https://nodejs.org/api/modules.html#caching)のか、
モジュール解決は行われていません。

上のログの間のモジュール解決に時間がかかっていることはわかったのですが、なぜこの場所にログが表示されているのかわかりませんでした。
`_document.js`も`_app.js`も`End require`が表示されているのでモジュールの解決が終わっているのだと思っていました。

これは、モジュール解決の同期/非同期が関係していました。理由がわからず悩んでいた時にビルドで生成される`_app.js`のファイルを眺めていて気づいたのですが、
`_app.js`や`_document.js`は、内部で`require`関数と`import`関数を使用して動的にモジュールを解決しています。
Node.jsは`require`関数は同期的、`import`関数は非同期的に実行します。`import`関数は`await`されています。
つまり、`Start require (_app.js | _document.js)`を実行したときに、`await import`に到達した時点で制御が外に戻り、以降のモジュール解決がマイクロタスクキューに積まれます。
モジュール解決がマイクロタスクになっているとすると、上のログの間でモジュール解決が実行されているのも納得できます。

これで、２つのログの間の不自然な4秒が、マイクロタスクとして実行されるモジュール解決であるとわかりました。
そして、モジュール解決のログを見ていると、Mantineという文字列を含むモジュールの解決が大量にありました。

この結果から、Mantineへの`import`文が大量のモジュール解決を引き起こしているのだとわかりました。
`_document.tsx`を見てみると、Mantineの[ColorSchemaScript](https://mantine.dev/theming/color-schemes/#colorschemescript)
というコンポーネントを`import`しており、ビルド時に生成される`_document.js`には、動的な`import("@mantine/core")`が含まれています。
ひとつのコンポーネントを使用するためだけに、`@mantine/core`のモジュール解決を発生させ、
`@mantine/core`が大量のMantineのモジュール解決を引き起こしていました。

不要な大量のモジュール解決が実行されてしまうのは、モジュール解決が動的に行われ、最適化がされないからだと思います。
`_document.tsx`や`_app.tsx`、SSRされるページのtsxファイルなど、バックエンドで実行される可能性のあるものは、
ビルド時にimport文が動的importに変換されていそうです。
なぜそうなっているかまでは調べきれなかったのですが、バンドルして必要なコードだけ含めるとモジュールのキャッシュが効かないというのもあるのかなあと思っています。

## importを削除して改善する

これまでの調査から、`_document.tsx`の中でMantineからimportしている`ColorSchemaScript`がレスポンスを遅くしているということがわかりました。
このコンポーネントは、darkやlightといったテーマの設定を埋め込むためのスクリプトタグをレンダリングするもので、
ユーザーのデフォルトのテーマとの不一致によるちらつきを防ぐことができます。

このコンポーネントをimportするのをやめ、インラインで実装することでパフォーマンスを改善しました。
`ColorSchemaScript`の実装では、テーマ切替時に`localStorage`に保存された値を参照するようなコードもあるのですが、
対象プロジェクトではテーマ切り替えは無いので、シンプルに実装することができました。

importを削除することで、 5 ~ 7秒 かかっていたレスポンスが 1 ~ 3秒 に短縮されました。

## さいごに

Next.jsのWebアプリがコールドスタート時に遅くなる問題について調査し、改善を行いました。

調査の結果、1つのimportが原因で大量のモジュール解決が実行され、レスポンスが遅くなっていることがわかりました。
当初、必要なモジュールだけが含まれていると考えていたのですが、そういった最適化は行われずに動的なモジュール解決に変換されているようでした。

また、調査を通じて、パフォーマンスの計測に役立つさまざまなツールやライブラリを知ることができました。
特にNode.jsのプロファイリングツールについては初めて聞くものも多く、問題が発生したときに役に立つと感じました。
一方でNode.jsに限らず、JavaScriptのモジュール解決についての知識が不足しているとも感じたので、もっと理解を深めていきたいです。

この投稿では、調査の過程を詳細に書きました。今後似たような問題が発生したときに、なにか一つでも役に立つことを願っています。

## (おまけ) - SSRのパフォーマンス改善

投稿では、Automatic Static Optimizationが適用されている静的なページの問題を調査しましたが、SSRされるページに遷移すると同じ問題が発生します。
ホーム画面へのリクエスト時にMantineのモジュールが解決されることはなくなったのですが、SSRされるページに遷移しようとすると、
Mantineの大量のモジュール解決が実行され、時間がかかってしまいます。

ホーム画面からの遷移だけを考えるのであれば、prefetchするという解決策があります。
もちろんSSRをやめることもできますが、僕は最初のレスポンスに完全なページが含まれるSSRは画面のちらつきが少なく、使っていて快適だと感じます。
そこで、ホーム画面に最初にアクセスするということがわかっている場合には、ホーム画面で他のページをprefetchしてバックエンドでSSRを実行させ、
Mantineのモジュールをキャッシュさせることができます。

これは、`fetch`を使ってprefetchしたいページをリクエストすることで実現できます。
Next.jsには`router`オブジェクトに`prefetch`という関数があるのですが、
この関数はprefetch先のページに必要なJSやCSSファイルを読み込むだけで、SSRは実行しないので使えません。
prefetchするページはMantineを使用していればなんでもよく、
それ以外のページをSSRするときにもキャッシュが使用されるので、効果があります。

ホーム画面が表示されると、データ取得のためにNext.jsで実装したAPIが実行されます。
このAPIの実行にも大量のモジュール解決が必要になるため、コールドスタート時には数秒待たされます。
そのローディング時にprefetchも並行で行うと、データが画面に表示されてすぐにrefetchが終わることもあるため、
そのデータの詳細画面への遷移をすぐに行えることも多いです。

なぜかキャッシュが使われないケースもあるのですが、そこまで調査はできていません。
