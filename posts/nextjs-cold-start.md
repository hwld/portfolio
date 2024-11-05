Next.jsで作った[aluep](/projects/aluep)というWebアプリをCloud Runにデプロイしていたのですが、
コールドスタート後のリクエストが遅くなるという問題がありました。
Cloud Runはコールドスタートが発生するため時間がかかるとは言われていますが、
メトリクスを見るとコンテナ起動のレイテンシは約1秒で、ページのレスポンスには5 ~ 7秒かかっていました。

この投稿は、何も知識がないところから、どうにかしてコールドスタート後のCloud Runで時間がかかっていそうな処理を見つけ、改善するまでの記録です。
あくまで、どの処理に時間がかかっているのかを調査しただけで、なぜ時間がかかっているのかまでは調べきれていません。

今後似たような調査を行うときに、どれか一つでも役に立つことを願って、やってきたことや関連する情報について詳細に書いてきます。
長くなってしまうので、最初に調査の概要と結果について書いたあと、調査記録を書きます。

## 調査の概要と結果

調査した環境は以下のとおりです。

- Cloud Run (+[CPUブースト](https://cloud.google.com/run/docs/configuring/cpu?hl=ja&_gl=1*bw91h3*_ga*MTI0NTcwNzE1MS4xNzI2OTYwMjQ1*_ga_WH2QY8WWF5*MTczMDc1MjY0MC41NC4xLjE3MzA3NTQ0MjAuNjAuMC4w#startup-boost))
- Next.js v14.2.6 Pages Router
- React v18.2.0
- [Mantine](https://mantine.dev/) v7.13.4

[Automatic Static Optimization](https://nextjs.org/docs/14/pages/building-your-application/rendering/automatic-static-optimization)
が適用されたページにリクエストを送ると、レスポンスに5 ~ 7秒かかってしまう原因について調査しました。
コールドスタート時のコンテナ起動のレイテンシが約1秒で、バックエンド側で処理があまり必要がないと考えていたため、ここまで時間がかかる原因がわかりませんでした。

結果は、`_document.tsx`にあるMantineからの`import`によって、大量のMantineのモジュール解決が発生していることが原因でした。
`import`を削除することで、ホーム画面のレスポンスが1 ~ 3秒まで改善しました。

## 調査記録

調査は、準備をしたり計画を立てるなどのことはせず、場当たり的に行っていました。
コードやログや設定を行ったり来たりしながら処理の流れを把握して、どこに時間がかかっているかを調査していきました。

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

> [!info]
> ちなみに、App Routerの[Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)は、
> ページコンポーネントの分岐に進み、コンポーネントと同じような処理がされます。Route Handlersはビルド時に`routeModule`に実際のハンドラの関数を持つ[AppRouteRouteModuleクラス](https://github.com/vercel/next.js/blob/2f43ba59e54cc45630638d1e1632ec81ee05b8f0/packages/next/src/server/route-modules/app-route/module.ts#L160)
> を埋め込みます。
> そして、`Server.renderToResponseWithComponentsImpl`関数のなかに、
> Pages Routerコンポーネント、App Routerコンポーネント、Route Handlersで分岐があり、Route Handlersの場合は、
[AppRouteRouteModule.handle関数が呼ばれます。](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/base-server.ts#L2235)

ここまでで、実際にリクエストがあったときに実行されていそうなパスのコードを見ていきました。
ただ、重要そうな箇所しか読んでいなかったので、実際に実行されるコードは異なっている可能性があります。

そこで、実行パスを可視化できないかを考えていました。

### debug関数で実行パスの分析

Next.jsのコードを読んでいるとき、`debug関数`が呼ばれている部分がいくつかありました。
例えば、`router-server.ts`のコードの中には、以下のようなコードが存在しました。

```ts
import setupDebug from 'next/dist/compiled/debug'

const debug = setupDebug('next:router-server:main')
...
debug('invokeRender', req.url, req.headers)
```

なんとなくデバッグ時に情報を出力するための関数だと思ったので、どうにかしてこれを表示できないかを調べました。
debugの実態は[ここ](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/compiled/debug/index.js#L1)にあるのですが、コンパイル(?)されており、読めたものではありません。
何も考えずにChatGPTに投げてみたところ、`setupDebug`に渡している文字列を`DEBUG`環境変数に設定すると表示できそうでした。

環境変数を新たに設定したリビジョンをデプロイしてみると、うまく表示されました。
ホーム画面へのリクエストを投げてみると、`invokeRender / { ... }`のようなログが表示されます。
これによって、リクエスト時に`invokeRender`関数が実行されることがわかります。`invokeRender`関数は、
内部で`render-server.ts`の`initialize関数`を呼び、取得したリクエストハンドラを実行する関数です。

```ts
    async function invokeRender(
      // ...
    ) {
      // ...
      debug('invokeRender', req.url, req.headers)
      // ...
      const initResult = await renderServer?.instance?.initialize(
        renderServerOpts
      )
      await initResult?.requestHandler(req, res)
      return
    }
```

<https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/lib/router-server.ts#L216-L289>

これまで読んできたコードの少なくとも最初の部分については実行されていると確認できました。
`invokeRender`のログのあとに数秒経過していることから、この処理に時間がかかっていることもわかります。

しかし、改善のためには情報が不足しています。
問題を改善するためには、ユーザーが実装しているコードのどの部分に時間がかかっているのかを把握する必要があります。

### Sentryのトレースで実行パスを分析

Next.jsのコードでは、`debug`関数よりも高い頻度で`getTracer`関数というものが使われています。
これは[NextTraceImpl](https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/lib/trace/tracer.ts#L161)クラスを作成する関数で、このクラスは[OpenTelemetry](https://opentelemetry.io/ja/)というフレームワークを使用して実装されています。

OpenTelemetry (OTel) は、オブザーバビリティのためのフレームワークのことで、トレース・メトリクス・ログといったテレメトリデータを作成・収集するためのものです。
オープンスタンダードで様々なベンダーによってサポートされているため、ベンダーに依存せずにオブザーバビリティを向上させることができます。

Otelには主要なモジュールとしてAPIとSDKがあり、APIはインターフェースのようなもので、SDKは実装です。
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

```ts
private async findPageComponentsImpl({
    page,
    // ...
  }: {
    page: string
    // ...
  }): Promise<FindComponentsResult | null> {
    const pagePaths: string[] = [page]
    // ...
    for (const pagePath of pagePaths) {
      const components = await loadComponents({
        distDir: this.distDir,
        page: pagePath,
        // ...
      })
      // ...
      return {
        components,
        // ...
      }
      // ...
    }
    return null
  }
```

<https://github.com/vercel/next.js/blob/3c01e3a9a17e5cc8d060b87e57d30ef544fe5dcd/packages/next/src/server/next-server.ts#L726-L798>

Next.jsでは`NEXT_OTEL_VERBOSE=1`を設定することで、より詳細なトレースを取得することができますが、Sentryではうまくいきませんでした。
デバッグ情報を出力するとトレースは取得されているようなのですが、Sentryのダッシュボードでは確認できませんでした。
この情報から、`findPageComponents`、`loadComponents`、 `renderToResponseWithComponents`の順に実行されていることはわかりましたが、所要時間はわかりません。

`debug`関数でのログとトレース情報によって、`invokeRender`の中で実行される`findPageComponents`に時間がかかることは確認できました。
このことから、どうやらコンポーネントのロードに時間がかかっていそうだということはわかりますが、まだ情報は足りません。

### v8 profilerで詳細な実行パスの分析

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
これができないとなると、Next.jsの内部にログを埋め込む方法しか思いつきませんでした。
幸い、調査の最中にNext.jsのコードは何度も読んでいるので、実行パスはなんとなく頭の中にあります。

### patch-packageのログ埋め込みで実行パスの分析

### NODE_DEBUGでモジュール解決ログで実行パスの分析
