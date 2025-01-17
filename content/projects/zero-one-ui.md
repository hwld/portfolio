---
title: zero-one-ui
createdAt: 2023-11-13
tags: [TypeScript, React, tailwindcss]
imageSrc: /screenshots/zou.png
summary: Reactを使って、パーツレベルから画面全体のレイアウトまで、さまざまなUIを作るためのプロジェクトです。
projectUrl: https://zero-one-ui.web.app
githubUrl: https://github.com/hwld/zero-one-ui
detailedDesc: |-
  Reactで様々なUIを作るためのプロジェクトです。
  非同期通信のシミュレーションのため、mswを使ってローカルにAPIサーバーを立てています。
  `/`キーで表示されるメニューのUIがお気に入りです。
---

## 概要

パーツレベルから画面全体のレイアウトまでの様々なUIを作るためのプロジェクトです。  

UIの引き出しを増やしたり、UIを素早く開発できるようになるために作りました。  
一度作ってしまえば、諸々のインストールやセットアップなどがほとんど必要ないので、気軽に作り始めることができます。  
作ったものがホーム画面に並んでいるので、成果物が蓄積されていく様子を実感し、モチベーションが上がります。

このプロジェクトの中で力を入れたUIは別のページで説明しています。  

- [zero-one-ui/github-projects](/projects/zero-one-ui-github-projects)
- [zero-one-ui/calendar](/projects/zero-one-ui-calendar)
- [zero-one-ui/todoist](/projects/zero-one-ui-todoist)

## 技術的な工夫

### MSWを使ったAPIサーバー

メモリ上だけで状態を持っていると、データの操作は同期的に行うことができるので、
ローディングUIを作る必要がなかったり、エラー時のUIもあまり考える必要がありません。  

そこで、ローカルにmswを使ってAPIサーバーを立てることで非同期通信を実現させています。  
APIの実装ではmswのdelayという関数を使うことで、ランダムな遅延を発生させており、できるだけローディングUIも作成しています。  
また、コマンドでエラーを擬似的に発生させることもできます。

Reactだけを使っている場合には、Reactを起動する前にmswを立ち上げるということができるのですが、
Next.jsを使っている都合上、そういったコードを実行する場所がありません。  
useEffectで`worker.start`を実行するだけだと、mswが立ち上がる前のfetchでエラーが発生してしまいます。  
今は妥協として、mswが立ち上がっているかを状態として持っておき、
立ち上がっていないときはfetchが発生しないような制御を行っています。  

### Storybookを使ったコンポーネントのテスト

また、UIのテストを書くためのサンドボックスとしてStorybookを導入しています。  
Jest / Vitestではなく、Storybookの[Play function](https://storybook.js.org/docs/writing-stories/play-function)
を使ってテストを書いています。  
Play関数は一つのストーリーにつき一つしか書くことができないのですが、内部でstep関数を`it`関数のように使っています。  
手動でクリーンアップするのは面倒ですが、[Storybookのメンテナの方が推奨](https://github.com/storybookjs/storybook/discussions/16861#discussioncomment-2513340)
しているようなので、テストはできるだけStorybookに寄せるというのを試しています。

### 開発サーバーの起動を高速化

開発サーバーの起動に40秒近くかかっており、更新のたびに長時間待たされるのがストレスだったため、なんとかして速くできないか調べていました。  

Next.jsはビルド時のトレースを.next/traceとして出力することがわかったので、実際に起動して眺めてみると、
react-iconsに時間がかかっていました。  
Next.jsのoptimizePackageImportsでは、react-iconsがデフォルトで最適化しているとあったので、
いい感じにやってくれていると思っていたのですが、なぜか遅くなっていました。  
Turbopackを使えば最適化されているようなのですが、色々と動かなかったので諦めています。  

react-iconsはすべてのアイコンを個別にexportしている@react-icons/all-filesというパッケージがあるので、
これを使っています。  
自動補完が効かないのが少し面倒くさいのですが、これを使うと起動時間が40秒から5秒ほどになりました。  

## こだわり

zero-one-uiでは、`/`キーでナビゲーションメニューがコマンドバーとして表示されるのですが、このUIがお気に入りです。  

![コマンドバー](/screenshots/zou-command-bar.png)

どのページからも表示することができ、好きなページに飛べます。  
また、一部のアプリではエラーをシミュレーションしたり、データを空にするといったコマンドも実行することができます。  
UIは[Linear](https://linear.app/)のコマンドバーを参考にしており、Linearよりも少しコンパクトにしています。

## スクリーンショットたち

![チャットの設定画面](/screenshots/zou-chat-settings.png)

[Discordの設定画面を見ながら作ったもの](https://zero-one-ui.web.app/chat/settings)です。  
Discordほどではないですが、Switchにアニメーションを設定していて、動かしていて気持ち良いです。

---

![todo作成ページ](/screenshots/zou-todo-2-create.png)

[Linearのissue作成ページを参考に作ったもの](https://zero-one-ui.web.app/todo-2)です。  
`Cmd + K`で作成ダイアログを開くことができて、タイトルにフォーカスがあたっているので、すぐに入力を開始でき、
エンターキーでタスクを作成できるので、キーボードから全く手を離さずに操作できます。

---

![Dynamic island](/screenshots/zou-dynamic-island.png)

[iPhoneのDynamic IslandのようなUI](https://zero-one-ui.web.app/dynamic-island)です。  
Dynamic Islandのような、小さいUIにいろんな情報が詰まっていたり、いろんなことができるものが僕は特に好きです。

---

![Audio player](/screenshots/zou-audio-player.png)

[オーディオプレイヤー](https://zero-one-ui.web.app/audio-player)です。  
ドロップした音声ファイルを再生することができます。  
10秒早送り・巻き戻しや、次の音声・前の音声に移動する機能を実装しています。

---

![Tree View](/screenshots/zou-tree-view.png)

[TreeView](https://zero-one-ui.web.app/tree-view)です。  
[1からTreeViewを実装している記事](https://www.joshuawootonn.com/react-treeview-component-part-3)
を参考に、ほとんどそのまま実装しました。  
