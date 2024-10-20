## 概要

[zero-one-ui](/projects/zero-one-ui)プロジェクトで作ったUIです。  
タスク管理アプリである[Todoist](https://app.todoist.com/app)のクローンとして作りました。  
複雑なUIの実装の練習に、実際に使われているサービスのUIを作ってみました。

可変で開閉可能なサイドバー、プロジェクトのCRUD、タスクのCRUDなどを実装しています。  
プロジェクトのリストはTreeになっていて、DnDによって位置を変更することができます。  
すべての機能を実装しているわけではないですが、様々な箇所で表示されるDropdownMenuも一部実装しています。

## 使用した技術

- TypeScript
- React
- Tailwind CSS
- Zod
- React Hook Form
- Floating UI

## 実装の詳細

### Treeのドラッグ・アンド・ドロップ(DnD)

todoistでは、サイドバーにあるプロジェクトのリストがTreeViewになっており、
DnDで位置や親子関係を変更することができるので、それを実装しました。  
実装するにあたって、木構造のアイテムを移動させる操作が難しかったのですが、まずフラットなリストに変換してから処理することで簡単になりました。  
木構造とフラットなリストの変換や、木構造の操作のロジックを実装するのが苦手だったのですが、
こういったアルゴリズムはChatGPTに聞くといい感じに実装してくれて便利でした。  

プロジェクトの並び替えのロジックのベースは、木構造を変換しているため、フラットなリストに対する並び替えで実装できます。

```ts
const move = (
  projects: Project[],
  fromId: string,
  toId: string
): Project[] => {
  const nodes = toProjectNodes(projects);

  const fromIndex = nodes.findIndex(p => p.id === fromId);
  const toIndex = nodes.findIndex(p => p.id === toId);

  const newNodes = [...nodes];
  newNodes.splice(toIndex, 0, newNodes.splice(fromIndex, 1)[0]);

  return toProjects(newNodes);
}
```

ベースはこのような実装になっています。  
このプロジェクトはサブツリーの開閉が行えることを想定しているので、隠れているサブツリーのアイテム数に応じてtoIndexを増加させたり、
特定の状況でfromIndexが指すノードをtoIndexが指すノードの子として追加するといった追加の処理があります。  

また、プロジェクトのIndexの移動だけではなく、親子関係の移動も実装しています。  
ノードはそれぞれdepthというプロパティを持っているので、移動が許されている場合にdepthを変更するといった実装で実現しています。  

DnDのロジックは純粋関数に切り出しているので、Vitestを使って簡単なテストも書いています。

### キャッシュを利用した楽観的更新

DnDの実行の際には、キャッシュを書き換えることによって楽観的更新を実現しています。
ドラッグによってプロジェクトが移動されると、キャッシュを書き換えて画面を更新し、ドラッグが終了したタイミングで、変更されたプロジェクトを更新するAPIリクエストを実行しています。
データフェッチにはtanstack-queryを使用しており、ドキュメントにも[楽観的更新についての解説](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)があります。今回は楽観的更新が複雑になりそうだったので、UI側での実装ではなく、キャッシュを操作する実装を選択しています。

楽観的更新を実現するために気をつけなければいけないのは、refetchによって楽観的に更新したデータが破棄されないようにすることです。
tanstack-queryのドキュメントでは、そのために`cancelQueries`というAPIを使っています。
これはすでに実行されているqueryを無視させるためのAPIであり、楽観的更新のデータが上書きされないようにしています。

大体のケースでは`cancelQueries`だけで良いかもしれませんが、mutationのあとに`invalidateQueries`を呼び出しているようなケースでは十分ではありません。
mutationが完了してqueryが実行されたあとに`cancelQueries`を使うと、そのqueryは無効になるのですが、
mutationが完了する前に`cancelQueries`を使っても、そのあとのqueryを無効にすることはできません。

このようなときにはmutation自体を無効化する必要があり、実装の方法としては、mutationFnに`AbortSignal`を渡す方法があります。

```ts
useMutation({
  mutationFn: async ({ data, signal }: Input) => {
    const res = await fetch("...", {
      body: data,
      signal
    })
    // ...
  }
})
```

tanstack-query側でAPIを用意してあると便利なのですが、そういったものは存在しません。
(昔から[discussions](https://github.com/TanStack/query/discussions/1551)で話されてはいますが、進展はないように感じます)

### zodのエラーメッセージのカスタマイズ

todoistのタスク作成フォームでは、タスクのタイトル・説明が制限を超えてしまった場合に、
「タスク名の文字数制限: 550 / 500」のようなエラーメッセージが表示されます。  
このプロジェクトではreact-hook-formとzodResolverを使用しているのですが、
デフォルトでは入力された値を使用したエラーメッセージを作ることができません。  
そこで、リゾルバに[ZodErrorMap](https://zod.dev/ERROR_HANDLING?id=customizing-errors-with-zoderrormap)
を渡してメッセージをカスタマイズしています。  

zodのスキーマとしてメッセージを指定している場合には、[そちらが優先される](https://github.com/colinhacks/zod/issues/2492#issuecomment-1657267265)
ので、ZodErrorMapで上書きすることはできません。  
zodでは、`schema.parse(value, { errorMap: ErrorMap });`のように、パース時にErrorMapを渡すことができるので、上書きできたら良いと思うのですが・・・。

### バックエンドのドメインバリデーション

ユニットテストのために、外部依存のあるバリデーションを純粋な関数に切り出して、外からgetter関数を受け取るようにしています。  

このプロジェクトにバックエンドは存在せず、MSWを使った擬似的なバックエンドなのですが、実際のバックエンド開発を想定して、
RDBへのアクセスなどの外部依存のあるバリデーションをどのように実装するかを考えていました。  

これまで作ってきたものは、ほとんどコントローラー層でそういったバリデーションを実行していたのですが、
テストするためにDBを起動しなければいけない事が多く、どうしてもテストに時間がかかってしまいます。
そこで、バリデーションを実行する関数をできるだけ純粋に保つために、外から関数を受け取り、DBなしでテストできるようにしています。
また、入力値を検証したあとにBrand型に変換して、それをRepositoryの入力として受け取ることで、検証済みのデータだけを受け取れるように工夫しています。
(検証する関数の外でasを使われると検証をスキップされてしまうのですが・・・)

```ts
type UpdateInput = { id: string, label: string };
type ValidatedUpdateInput = UpdateInput & Brand<"UpdateInput">;

export const validateUpdateInput = (
  input: UpdateInput,
  getters: { getProject: (id: string) => Project | undefined },
): ValidatedUpdateInput => {
  const project = getters.getProject(input.id);
  if (!project) {
    throw new Error(`プロジェクトが存在しない: ${input.id}`);
  }

  return input as ValidatedUpdateInput;
};
```

このようにすると、`validateUpdateInput`をテストするのにDBが必要ないので、
バリデーションが複雑になってきても多くの異常ケースを短い時間でテストすることができるようになると考えています。

### インボックスとプロジェクトの区別

todoistでは、インボックスとプロジェクトという概念が存在します。

どちらにもタスクやセクションを作成することができて似たような概念なので、todoistのAPIリクエストを見る限りはインボックスもプロジェクトの一種として扱われていましたが、このプロジェクトでは区別しています。
インボックスはラベルの更新や削除をすることができなかったり、プロジェクトリストの取得でもインボックスは含まれていないなど、事実上は区別されているように感じたためです。

このプロジェクトではすべてのデータをインメモリに保存しているため柔軟に保存できるのですが、RDBに保存することを考えてタスクテーブルのスキーマに迷っていました。
`project_id`をもたせるとして、区別する対象はインボックス一つなのでnullの場合にインボックスだと判断することもできるのですが、わかりにくいというのとできるだけnullを扱いたくはないです。フラグに応じて紐づけるテーブルを変更するポリモーフィック関連も考えましたが、外部キー制約が使えないといった理由でアンチパターンとなっているため、見送りました。

[SQLアンチパターン](https://www.oreilly.co.jp/books/9784873115894/)という書籍には、こういった場合の解決策が書かれてあり、その中の一つであるクラステーブル継承を選びました。
この方法は簡単に言うと、異なるテーブルの共通部分を親として別テーブルに切り出して、子側の外部キーに親を参照させる方法です。
これを使用して、インボックステーブルとプロジェクトテーブルを分離して、タスクボックスという親概念を作りました。

## 学び

UIを作るときには、まず全体を作ったあとに細かい調節をしたほうが良いと学びました。  
画面設計やコーディングでUIを作るとき、まっさらな画面に少しずつUIを追加していきますが、
画面にUIが少ないときには、良さそうなUIを作っても微妙に見えてしまうと感じました。  
その時点で微調整を加えても良くなった実感がなく、時間を無駄にしてしまうことが多いです。  

また、複雑なUIになればなるほど、HTML/CSSを書いてUIを作るのが大変になってくるので、
試行錯誤の段階は画面設計で行うほうが時間の節約になると感じました。
