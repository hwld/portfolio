---
title: tsch-farm
createdAt: 2024-09-03
tags: []
imageSrc: /screenshots/tsch-farm.png
summary: monaco-editorを使って作った、type-challengesを快適に解くためのWebアプリです。
projectUrl: https://tsch-farm.pages.dev/
githubUrl: https://github.com/hwld/tsch-farm
---

## 概要

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.ja.md)を快適に解くためのWebアプリです。

暇なときにtype-challengesの初級をすべて解いていたのですが、リポジトリから問題を解くのは何度も画面遷移しなければならず、
TypeScript PlaygroundのPluginsは動作が安定しなかったので、快適に解くことができるようなWebアプリを作りました。

難易度ごとの問題セットを解いたり、自分で問題セットを作成、更新、削除できます。
データはすべてローカルストレージに保存しているので、データの内容が変更されたときにはある程度自動でマイグレーションを実行する機能もあります。

## 使用した技術

- TypeScript
- Next.js (Static Exports)
- React Aria Components
- Tailwind CSS
- GitHub Actions
- Cloudflare Pages

## 実装の詳細

### 問題の読み込み

type-challengesの問題は、jsonとしてgitで管理しています。
手書きでファイルをコピーしてくるのではなく、GitHubから問題を読み込むスクリプトを実装して、更新があるたびに手動で実行するようにしています。
GitHub ActionsでCI/CDを行っているので、このときに読み込むこともできるのですが、
ビルド時に実行すると頻繁にGitHub APIが実行される可能性があるのでgitで管理しています。

そのあと、React Server Componentsの中でファイルシステムから問題を読み取り、
Next.jsのビルド時にすべてのデータを埋め込んでいます。

### エディター

![editor-screenshot](/screenshots/tsch-farm-play.png)

問題を解くために使っているエディターとして、monaco-editorを使用しています。

type-challengesには、型の判定に`@type-challenges/utils`というパッケージで定義されている型を使っているので、
どうにかしてこのパッケージを持ってくる必要があります。
そこで、[この記事](https://zenn.dev/steelydylan/articles/vs-code-experience#2.-package.json%E3%81%A7%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%82%93%E3%81%A0%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%81%AE%E5%9E%8B%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B)を参考にして、esm.shというCDNでパッケージをリクエストしたときに付与される`x-typescript-types`というヘッダーから型情報のURLを取得して、
monaco-editorに追加しています。

また、monaco-editorにはショートカットを登録する機能があるので、キーボードで次の問題、前の問題に移動できるようにしています。
ショートカットの登録のために使用する`KeyCode`や`KeyMod`を直接importすると、
enumを使用しているからなのか、ビルドに失敗したり開発サーバーが遅くなるので、コールバックを渡すという回りくどい設計になっています。

### 紙吹雪を飛ばす

すべての問題のエラーをなくしたときに紙吹雪を舞わせるようにしました。

monaco-editorではMarkerという仕組みによって発生しているエラーを検出することができます。
Markerが更新されたときにイベントハンドラを実行することもできるため、そのなかですべての問題のエラーを追跡しています。
それと合わせて、右側に表示している問題のリストでもエラーの有無がわかりやすいように色を付けています。

紙吹雪を飛ばすためには[react-confetti](https://github.com/alampros/react-confetti)というライブラリを使用しています。
設定はよくわからないのですが、パラメーターをいじってそれっぽくしました。

### ローカルストレージのマイグレーション

このWebアプリは、すべてのデータがローカルストレージに保存されます。
ローカルストレージに保存するデータのフォーマットが変わると、
以前のフォーマットで保存されている場合に壊れる可能性があるので、自動でマイグレーションする機能を実装しています。
以下のように特定のkeyのストレージのデータを変換するようにしています。

```ts
export const config = defineAppConfig({
  version: 3,
  migrationConfig: [
    {
      key: storageKey,
      migrations: {
        1: (d: SchemaV1): SchemaV2 => {/* ... */},
        2: (d: SchemaV2): SchemaV3 => {/* ... */}
      }
    }
  ]
});

//  保存されているnversionが1の場合には、1と2のmigrationsが実行される
//  保存されているversionが2の場合には、2のmigrationsが実行される
migrateLocalStorage(config);
```

`config`にもいくつかの制約があるのですが、型レベルで縛るのは難しそうだったので、
`defineAppConfig`という関数を作って、その中で検証しています。
マイグレーションはVitestでちょっとだけテストを書いてます。
