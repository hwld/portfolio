---
title: 50-react-projects
createdAt: 2020-08-15
tags: []
imageSrc: /screenshots/50-react-projects.png
summary: 50ReactProjectsという存在するプロジェクトのうちいくつかを作ってみたものです。
githubUrl: https://github.com/hwld/50ReactProjects
---

## 概要

[一つのプロジェクト](/projects/react-notes)のコードベースをずっと触っているときに感じた、
スキルを伸ばすためには様々な種類のWebアプリを作るのも大切ではないかという考えから生まれたプロジェクトです。
[50ReactProjects](https://50reactprojects.com/)という、
Reactで作ることを想定している50のプロジェクトのアイデア集からいくつかのプロジェクトを作ってみたものです。

Webフロントエンドだけで完結するものから、バックエンドも実装したものまで、様々な8つのプロジェクトを作りました。

## 使用した技術

- TypeScript
- Next.js
- Prisma

## このプロジェクトから学んだこと

Stripeを使って決済機能を実装してみたプロジェクトからは、膨大なドキュメントを読む際には、
全体像を把握することが大切ということを体感しました。  
Stripeのドキュメントは膨大で、似たような機能が多く、その中から目的の機能や実現できることを探すためには、
まず全体像を軽く把握してから、各機能の概要を掴む必要があると感じました。

Google Formのような、[Formを作成して回答してもらうようなWebアプリ](https://github.com/hwld/50ReactProjects/tree/master/business_and_realworld/survey_creator_and_manager)
も作りました。  
このプロジェクトでは、Google Formにもあるような追従するメニューを実装したのですが、
そのメニューの位置を動的に変更してくロジックを書くのが大変でした。  
ある挙動を実装すると、別の挙動がおかしくなるのでそれを修正して、という繰り返しでしたが、DOMのAPIを触ることに抵抗がなくなりました。  

![screenshot](/screenshots/50rps-survey.png)

[Webで動くピアノ](https://github.com/hwld/50ReactProjects/tree/master/fun_and_interesting/musical_instrument)
も作りました。  
好きな音程のピアノを追加したり、キーボードショートカットを割り当てたり、ドラッグ&ドロップで位置を入れ替えることができます。  
もともとはピアノの音名(C,D,Eなど)とオクターブ記号(1,2,3など)をあわせてTypeScriptのTemplate Literal Typesで表現しようとしたのですが、
取り回しが悪かったため、それぞれをプロパティとして持つオブジェクトを作って管理しています。  
複雑にせずに、シンプルに実装することでコードがわかりやすくなることを実感しました。

![screenshot](/screenshots/50rps-piano.png)
