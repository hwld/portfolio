---
title: housing-loan-simulator
createdAt: 2022-09-20
tags: []
imageSrc: /screenshots/housing-loan-simulator.png
summary: 住宅ローンの料金を計算するWebアプリです。結果を画像として出力する機能も実装しています。
githubUrl: https://github.com/hwld/housing-loan-simulator"
---

## 概要

Reactで作った住宅ローンシミュレータです。
希望する月々の返済額や年収から借り入れできる金額を予測したり、
借入可能額から月々の返済額を求めることができます。
シミュレーション結果はローカルストレージに保存し、ブラウザを閉じても履歴が消えないようにしています。

入力した数値と結果を画像をして出力することもできます。
![シミュレーション結果例](/screenshots/housing-loan-simulator-result.png)

すべてのフロントだけで動いています。
ダウンロードする画像はhtml-to-pngを使って作っていて、このライブラリがBase64エンコードされた画像のURLを返すので、
それをダウンロードさせています。
これを使用するためには、ダウンロードさせたい要素がDOM上に存在する必要があるので、見えない場所にダウンロードさせる画像の要素を置いています。

覚えていないのですが、コードを見ると、きれいなコードを意識しているのが感じ取れました。
シミュレーションのためのロジックや、シミュレーションに使う入力値のzodスキーマを、
`src/models/simulator/(repalyment|borrowable)`に整理していたり、
シミュレータのUI関連のコードを`src/components/simulator`を作り、
更に細分化して整理しているところなどからそう感じました。
