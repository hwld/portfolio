---
title: zero-one-ui/github-projects
createdAt: 2024-03-27
tags: []
imageSrc: /screenshots/zou-github-projects.png
summary: GitHub Projectsの見た目をできるだけそのままに作ったクローンアプリです。機能もそれなりに実装しています。
projectUrl: https://zero-one-ui.web.app/github-project
githubUrl: https://github.com/hwld/zero-one-ui/tree/main/src/app/github-project
---

## 概要

[zero-one-ui](/projects/zero-one-ui)プロジェクトで作ったUIです。  
ReactでGitHub Projectsの見た目をできるだけ真似をして作りました。  

ただのドロップダウンメニューやネストできるものなど、細かい違いのあるドロップダウンメニューも作っています。

![ドロップダウン](/screenshots/zou-github-projects-dropdowns.png)

---

コマンドからタスクの取得エラーや、タスクの更新エラーを発生させることができ、
それぞれのエラーはユーザーにわかりやすいように表示しています。  

![エラーページ](/screenshots/zou-github-projects-error.png)

---

![エラートースト](/screenshots/zou-github-projects-toast.png)

### 機能

- ビューの作成・更新・削除
- タスクの作成・更新・削除
- タスクのドラッグ&ドロップによる移動
- Status列のドラッグ&ドロップによる移動

## 使用した技術と実装の詳細

- TypeScript
- Next.js
- Tailwind CSS
- Floating UI

ドラッグ&ドロップはライブラリを使って実装したことしかなかったのですが、
今回は何も使用せず、[HTML ドラッグ&ドロップ API](https://developer.mozilla.org/ja/docs/Web/API/HTML_Drag_and_Drop_API)
をそのまま使用して実装しました。  
想像していたよりも使いやすく、シンプルなものならこれで十分だと感じました。

ドロップダウンメニューは、最初はRadix UIを使用して実装しようと思ったのですが、マウスを使用してメニューを閉じた場合にも、
メニューのトリガーとなった要素にfocus-visibleが付与されてしまうため、Floating UIを使って実装しています。  
原因としては、[現在のRadix UIはフォーカスの管理をプログラムで行っている](https://github.com/radix-ui/primitives/issues/1803#issuecomment-1400023626)
ためらしいです。  
他のヘッドレスUIライブラリとして[React Aria](https://react-spectrum.adobe.com/react-aria/index.html)
というものもあるのですが、こちらはdata属性を使ってスタイルを当てることができます。  
様々な擬似クラスをdata属性を使って拡張しており、例えばhoverクラスにスタイルを当てると、
モバイルでタップしたときにもスタイルが当たってしまうといった問題が起きないらしいです。

## このプロジェクトから学んだこと

これまで、実際のプロジェクトに似たWebアプリはいくつか作ったことがあったのですが、
UIをそのまま作ったことはありませんでした。  
CSSがそこまで得意ではなく、UIコンポーネントライブラリを使っての開発ばかりだったので、
難しそうだと感じて避けていたのですが、実際に作ってみると学びがありました。

自分で一から作るのと違って、こういうコンポーネントがほしいから、
前に作ったものをそのまま流用するということが殆どできません。  
テキストだけが表示されているボタンを作ったあとに、
そのボタンにアイコンが付いたコンポーネントや色が異なっているコンポーネントを見つけることがよくあります。  
こういった状況に対応するために、propsで分岐させることもできますが、
これが増えてくるとコンポーネントが複雑になってくるため、以下のコードのように、
`children`を使用した細かいコンポーネントを作っていくことで対応できると学びました。  

```tsx
type Props = { /* ... */ };

const ItemBase: React.FC<Props> = (
  {...props}
) => {
  const value1 = useSomething1();
  const value2 = useSomething2();

  useSomething3();

  return (
    <button {...value1} {...value2} {...props} className={/* .. */}>
      {children}
    </button>
  );
}
```

似たようなコンポーネントを見つけたときに、どの部分を共通化するとよいかを考えるトレーニングにもなると感じました。  

そもそも共通化しないでコピペで済ませるべきではないかとも考えたのですが、
Webフロントエンドの見た目だけを含むようなコンポーネントは、
誤った共通化をしたとしても分離させるのがそこまで難しくなく、
見た目を修正するために複数箇所のコードを変更するほうが面倒くさいと感じるため、積極的に共通化してもよいのではないかと考えています。
