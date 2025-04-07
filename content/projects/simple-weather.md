---
title: simple-weather
createdAt: 2025-01-28
tags: []
imageSrc: /screenshots/simple-weather.png
summary: Next.jsでRSCを使用して作った、天気予報を表示するWebアプリです。
projectUrl: https://simple-weather-steel.vercel.app
githubUrl: https://github.com/hwld/simple-weather
---

## 概要

Next.jsでRSCを使用して作った天気予報を表示するWebアプリで、1週間の期限を決めて画面設計から実装、デプロイまでを行いました。

このWebアプリでは検索フォームに入力した地域名や経緯度の天気予報を取得し、今日から2日後までの予報を表示します。
ホーム画面ではアクセス元のIPアドレスから地域情報を取得し、その地域の天気予報ページへのリンクも表示されます。
また、レスポンシブデザインを意識しているため、モバイル端末でも快適に閲覧できます。

![検索フォーム](/screenshots/simple-weather-search-form.png)
*検索フォーム*

![検索フォーム](/screenshots/simple-weather-detail.png)
*時間ごとの天気情報*

## 使用した技術

- TypeScript
- Next.js
- Tailwind CSS
- PlayWright

## 実装の詳細

### RSCとクライアントコンポーネント

動的なコンテンツが少ないので、基本的にはRSC(React Server Components)を使用して実装しています。
RSCの中で外部の天気予報APIを呼び出して天気情報を取得しており、天気予報APIからのレスポンスの待機中にはローディング画面が表示されます。

検索フォームは動的コンテンツなのでクライアントコンポーネントとして実装しています。
検索に使用するAPIはNext.jsのRoute Handlersで実装しており、内部で天気予報APIを呼び出しています。
フロントエンドから外部の天気予報APIを呼び出してしまうとAPI KEYが露出してしまうため、こういった方法を取っています。

### バリデーションや型付け

Next.jsのDynamic RoutesのParamsやURLSearchParams、APIのレスポンスなどの外部と通信する際のデータはできるだけzodを使用したバリデーションを行い、想定していない型のデータが入ってきたときにできるだけ早い段階でエラーになるようにしています。

また、Route HandlersのURLやWebアプリ内のURLは文字列を直接使用するのではなく、別途作成したオブジェクトを通して行います。
このオブジェクトは、必要なParamsやURLSearchParamsなどのオブジェクトを受け取って対応するURLを返す関数を持っています。

```ts
export const Routes = {
    weatherSummary: (params: WeatherSummaryParams) => {
        return `/weather/${params.locationId}`;
    },
    // ...
}

export const ApiRoutes = {
    locationSearch: (params: LocationSearchParams) => {
        const searchParams = new URLSearchParams(params);
        return `/location-search?${searchParams.toString()}`;
    }
}
```

上記のコードに含まれる、ページやRoute Handlersに対応する型やスキーマは`page.tsx`や`route.ts`と同じ階層にある`schema.ts`で定義しています。

```ts
// app/weather/[locationId]/schema.ts

import { z } from "zod";

export const WeatherSummaryParamsSchema = z
  .object({
    /** 地域検索の結果得られたID */
    locationId: z.string().min(1),
  })
  .strict();

export type WeatherSummaryParams =
    z.infer<typeof WeatherSummaryParamsSchema>;
```

また、`schema.ts`で定義したスキーマをコンポーネント内で使用してバリデーションも行っています。

```tsx
// app/weather/[locationId]/page.tsx

export default async function Page({ params }: Props) {
    const { locationId } = 
        WeatherSummaryParamsSchema.parse(await params);

    // ...
}
```

### ローディング

ローディング中はスケルトンスクリーンを表示しています。できるだけ本来のページとレイアウトを共通化するためにレイアウトのためのコンポーネントを分割し、それを実際のページと`loading.tsx`で使用しています。

Next.jsでは`layout.tsx`でレイアウトを定義できはするのですが、柔軟性のためにこういった実装にしています。
例えば以下のようにページごとに異なるコンポーネントを共通の場所にレンダリングしたいときなど、`layout.tsx`では実現できないと思います。

```tsx
function Page1() {
    return (
        <Layout header={<Page1Header />}>
            <Page1Content>
        </Layout>
    );
}
```

実装してみるまではスケルトンスクリーンにそこまで良い印象を持ってはいなかったのですが、ローディング後のページのレイアウトを保てるのであれば、そこまで気にならないと感じました。
一方で実装の難易度は高いとも思うので、NProgressのような画面上部に表示するプログレスバーも良いとは思います。
Next.jsのApp Routerではrouter.eventsがなくなっているので実装するのが難しいのですが、僕は最近リニューアルされた[BProgress](https://bprogress.vercel.app/)というライブラリに注目してます。

### エラーハンドリング

エラーハンドリングでは基本的には`Result`型を使用しつつ、個別にハンドリングしないエラーや対処できないエラーは例外を発生させ、`src/app/error.tsx`でエラーページを表示するようにしています。
Route handlersでは例外を受け取ったら500エラーを出すようにしています。

現状では`Result`型で複雑なことを行う必要性がなかったので、`Result`型を生成する関数や、`isOk`や`isErr`などの判定のための関数のみを自作で実装し、手続き型でハンドリングしています。

### テスト

テストではPlaywrightを使用しています。
PlaywrightにはフロントエンドからのAPIアクセスをモックする機能があるのですが、RSCのようなバックエンド内でのfetchをモックすることはできません。
Next.jsではこれを実現するために、現時点ではexperimentalな[testmode](https://github.com/vercel/next.js/blob/canary/packages/next/src/experimental/testmode/playwright/README.md)という機能が提供されています。これを使用することでRSCで実行しているfetchも以下のようなコードでモックすることができます。

```ts
text('テスト', async ({page, next}) => {
    next.onFetch((req) => {
        if (req.url === ApiUrl) {
            return new Response(JSON.stringify({/* ... */}));
        }
        return 'abort';
    });
})
```

テストはできるだけユーザーの操作に近いような形で行っています。例えば要素を取得する際にはtestIdではなくroleやラベルを使用しています。

## 学び

このWebアプリではスタイリングの技術をCSS Modules -> Panda CSS -> Tailwind CSSと切り替えてきたのですが、
開発生産性の点でいうとTailwind CSSが一番良いと思いました。

CSS Modulesは生のCSSを書けて腐りにくいというメリットはあると思うのですが、スタイルを確認するために別ファイルを開くという手間が面倒になりやすい、命名が難しいと感じました。
現代のHTML/CSSは、両者を切り離せるという考えはあまり適用できなくなっていると思います。例えばFlexなどはスタイルを変更するためにdivを追加するなどHTMLの構造を変更する必要が出てきます。
なのでスタイルを確認したいときや修正したいときには結局HTMLとCSSの両方を見なければいけず、ファイルを行き来するのが面倒でした。
また、スタイルをつけたい要素にはクラスをつけるのが一般的だと思うのですが、クラスの命名に時間がかかっていました。

Panda CSSではJSXとスタイル情報を一緒に見たい、命名を減らしたいという考えからインラインスタイルの記法を選択したのですが、行あたりのスタイルの情報量が少なく見通しが悪くなりやすいと感じました。
例えば以下はPanda CSSのplaygroundにあるサンプルコードなのですが、ほぼ1行に1つのプロパティを設定しています。

```tsx
import { css } from 'styled-system/css';
import { center } from 'styled-system/patterns';

export const App = () => {
  return (
    <div className={center({ h: 'full' })}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          fontWeight: 'semibold',
          color: 'yellow.300',
          textAlign: 'center',
          textStyle: '4xl',
        })}
      >
        <span>🐼</span>
        <span>Hello from Panda</span>
      </div>
    </div>
  );
};
```

コンポーネントのコード量が少ない場合には見通しの悪さは感じないとは思うのですが、コンポーネントが大きくなってくるとスタイル情報が占める画面の割合が大きく、スタイル以外のコードが探しにくくなります。コンポーネントを分割することで解決できますが、僕は大体のケースで「ロジックが混ざっている」「再利用したい」という理由以外でコンポーネントを分割するのは逆にコードの変更が大変になると考えているので、あまりUIの都合でコンポーネントを分割したくなく、辛かったです。

Tailwind CSSには上記の問題が無く、書いていて快適だと感じました。
ドキュメントの構造とスタイルの情報が分離されていないため別のファイルに移動する必要はないですし、命名の機会も減り、1行に複数のスタイル情報を含めることができます。
よくTailwind CSSは見通しが悪くなるというデメリットがあると言われています。確かに一行に複数のスタイル情報が書かれていると、スタイルの情報に関心があるときには読んだり変更するのが少し面倒だとは思います。一方でドキュメント構造とスタイルを分離させないという手法を取る場合には、1行に1つのプロパティを指定する方法だとスタイルで他の情報の見通しが悪くなってしまいます。
僕は1行に1プロパティのほうがコードを触るのが辛いと感じたので、Tailwind CSSが一番快適にかけると感じました。

スタイリング以外だと、期限が決まっている開発ということもあって、自分がどの作業に時間がかかっているのかを把握することができました。
僕はUI関連とリファクタリングの作業にそれぞれ3割ほどの時間をかけていました。
UIのデザインに特に時間がかかっていると感じており、いい感じのUIをはやく考えるためにはもっとデザインの経験を積む必要があると感じました。
また、僕は最初に汚いコードを書いたあとにリファクタリングをするという方法でコードを書くことが多いのですが、ある程度は考えてから実装したほうが効率的だと感じたので、試してみたいです。
