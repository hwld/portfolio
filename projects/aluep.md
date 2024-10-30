## 概要

アプリ開発のお題を投稿・検索できるWebアプリです。

技術力を伸ばすためには、実際に開発を行う必要がありますが、作りたいものがないという人が多いと感じて作ったWebアプリです。  
アプリケーションの案である、「お題」が集まるようなプラットフォームとして開発しました。  
他人のコードを参考にしたいという人がお題を投稿し、作りたいものがない人や、面白いお題だと感じた人が取り組むことを想定していました。  

というのは建前で、バックエンド・フロントエンド両方でTypeScriptを使用して、そこそこの規模のWebアプリケーションを作りたいという目的で開発を行っていました。

Next.jsをCloud Runで動かしていて、初回起動に十数秒かかってしまいます。  
また、一定期間アクセスがないとデータベースが止まってしまうためエラーになります。  

### 機能一覧

- GitHubによるログイン機能
- アプリ開発のお題を投稿・更新・削除する機能
  - お題にアップロードした画像を添付する機能
- アプリ開発のお題を開発・開発情報の更新・削除する機能
  - 開発時に自分のGitHubリポジトリを選択する機能
- お題・開発情報にいいねする機能
- お題・開発情報にいいねした人の一覧を表示する機能
- お題・ユーザーを検索する機能
- 開発情報にメモを残す機能
- ユーザーをお気に入り登録する機能
- ユーザーが投稿したお題、開発したお題などのアクティビティを表示する機能
- プロフィールアイコンをアップロードする機能
- ユーザーやお題、開発情報などの通報機能
- お題詳細画面のOGP
- アップロードした画像の一覧表示・削除機能
- 一覧画面のページング
- Aboutページ

## 使用した技術と実装の詳細

- TypeScript
- Next.js
- NextAuth.js
- Mantine
- tRPC
- Prisma
- Cloud Run
- Cloud Storage
- Supabase Database
- Jest
- Storybook
- GitHub Actions

### デプロイ環境

できるだけお金をかけないために、アプリはGoogle Cloudにデプロイしています。

Next.jsは立ち上がりが遅いみたいで、Cloud Runのコールドスタートを含めて、レスポンスが返ってくるまでに十数秒かかってしまいます。  
Next.jsの立ち上がりが遅いという問題は調べると色々と出てくるのですが、解決できそうになかったので諦めています。
(参考: [関連するdiscussions](https://github.com/vercel/next.js/discussions/12447)、
[Cal.comの記事(tRPCが原因かも？)](https://cal.com/blog/cal-com-cold-start-resolution-blog))

トップページのレスポンスを少しでも早く返すために、トップページでSSRを使用せずにスケルトンスクリーンを実装し、CDNで配信することも考えましたが、
できるだけコストをかけないで行う方法が、Firebase Hostingか、Vercelにデプロイするくらいしか見つかりませんでした。  
Firebase Hostingはcookieが扱えなかったり、Vercelはページの表示は早いのですが、
無料プランだと10秒でタイムアウトしてエラーが出てしまうため、Cloud Runをそのまま使用しています。  
SSRをやめたことで、数秒だけ表示されるのが速くなっています。

Cloud Storageはアップロードされた画像を保存するために使用しています。  
画像のアップロードは署名付きURLではなく、バックエンドに一度画像を送って、そこからCloud Storageに保存しています。  
細かい制御を行うためにはバックエンドで処理する方が良いと思って使わなかったのですが、よくわかっていません。

### CI / CD環境

GitHub Actionsでテストとビルドを実行し、Cloud Runにデプロイしています。  

テストは、compose.ymlにあるdbだけを起動し、環境変数でそのdbに向けて実行しています。  
GitHub Actionsでは、jobをtestとbuild_and_deployに分けていて、後者でデータベースのマイグレーションを行っています。  
そのため、初めはトップレベルのenvにDATABASE_URLを定義して、dotenvでテスト時にだけテスト用のDBに向けようとしていたのですが、
dotenvはデフォルトで環境変数を上書きしないので、しばらく本番環境のRDBに向けてテストを実行していました・・・。  
一応データベース名はテスト用のものにしていたので、本番環境のデータを触ってしまうことはなかったのですが、
テストがとてつもなく遅かったです・・・。  

ビルドとデプロイでは、Dockerイメージをビルドし、Google CloudのArtifact Registryにpushしたあと、
Cloud Runにそのイメージをデプロイしています。  
GitHub ActionsからGoogle Cloudを利用するために、初めはサービスアカウントキーをGitHubのsecretに登録してアクセスしていたのですが、
現在はWorkload Identity連携を使用しています。  
これを使用することで、GitHubはGoogle CloudにIdトークンを送信し、Google Cloud側で検証したあとに、
対応するサービスアカウントの権限借用のための一時的なトークンをもらえます。  
Google Cloud側でいくつか設定を行う必要はありましたが、GitHub Actions側の設定は、actionが用意されていたので簡単に行えました。  

Dockerのビルドではキャッシュを使用してできるだけ時間を短縮できるように工夫しています。  
キャッシュを使用したビルドを行うためのactionはあるのですが、
GitHub Actionsでは[キャッシュが大きくなってしまう](https://github.com/docker/build-push-action/issues/252)
ため、actions/cacheを使用してキャッシュの領域を作成し、古いキャッシュを自分で削除するようにしています。  
また、Google Cloudに保存しているDockerイメージも、 最新の3つ以外は削除するようにしています。  

### tRPC

バックエンドとフロントエンドの通信には、型安全なAPIを作成できる[tRPC](https://trpc.io/)を使用しています。  
バックエンドで定義したAPIエンドポイントを、関数を呼び出すように実行することが可能で、あらゆるものに型がつきます。  

tRPCでは、以下のようなコードでAPIを実装し、フロントエンドから呼び出すことができます。

```ts
// backend
const t = initTRPC.create();

const appRouter = t.router({
  task: t.router({
    get: t.procedure
      .input(getTaskInputSchema)
      .query(async ({ input }) => {
        const task = await db.task.find({
          ...input
        })

        return task;
      })

    create: t.procedure
      .input(createTaskInputSchema)
      .mutation(async ({ input }) => {
        const task = await db.task.create({
          ...input
        });

        return { task.id };
      });
  })
});

type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter
});

server.listen(3000);

// frontend
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000"
    })
  ]
});

// ✅ 各routeには型がついているので、補完が効きます
const task = await trpc.task.get.query({ id: "1" });
const created = await trpc.task.create.mutate({ title: "todo" });
```

フロント側で呼び出しているコードから、バックエンドのルートハンドラまでジャンプすることができるので、
コードを確認するのも楽ですし、ルートハンドラのインプットとアウトプットの型が変わったことを検出することもできます。

このプロジェクトでは、機能ごとにrouterを作り、ハンドラごとにファイルを切っています。  

```ts
const userRouter = t.router({
  create: createUser
});

const taskRouter = t.router({
  create: createTask
})

const appRouter = t.router({
  user: userRouter,
  task: taskRouter
});
```

そうすることで、どこにコードが存在するのか探しやすくなっていると感じています。  
ファイル検索でcreateTaskなどと入力するだけでコードを見に行けるのが快適でした。  

いわゆるミドルウェアのようなものも実装できるようになっています。  
ミドルウェアからContextに追加情報を渡すことが可能なのですが、これに型が付いていて、ルートハンドラから利用しやすくなっています。  
例えば認証を行うミドルウェアを実装して、Contextにログインしているユーザーをセットすることで、
ルートハンドラから型がついたユーザー情報を使用することができます。  

```ts
const isLoggedIn = t.middleware(async ({ctx, next}) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "FORBIDEN" });
  }

  const loggedInUser = await findUser({/* ... */});
  if(!loggedInUser) {
    throw new TRPCError({ code: "FORBIDEN" });
  }

  return next( ctx: { session: { user: loggedInUser } } );
})

const requireLoggedInProcedure = procedure.use(isLoggedIn);

const handler = requireLoggedInProcedure.query(async ({ ctx }) => {
  // ✅ session.userに型がつき、nullableではないことが保証されています
  const loggedInUser = ctx.session.user;

  // ...
});
```

### バックエンド

各ルートハンドラは、基本的にはPrismaを使用してCRUDを書いています。  
更新系はPrismaを直接使用して行っているのですが、参照系はPrismaを直接使用せず、モデルごとに以下のようなラッパーを作って使用しています。  

```ts
type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  author: { id: string; name: string };
} 

const taskArgs = {
  include: {
    user: true
  }
} satisfies Prisma.TaskDefaultArgs;

const convertTask = (
  raw: Prisma.TaskGetPayload<typeof taskArgs>
): Task => {
  return {
    id: raw.id,
    title: raw.title,
    status: raw.status,
    author: { id: raw.user.id, name: raw.user.name }
  };
}

const findTask = async (
  { tx, ...args }: FindFirstArgs<"task">
): Promise<Task | undefined> => {
  const client = tx ?? db;
  const raw = await client.development.findTask({
    ...args,
    ...taskArgs,
  });

  if (!raw) {
    return undefined;
  }

  return convertTask(raw);
};

// ✅ モデルに必要なフィールドをselectする必要がありません
const task = await findTask({ where: { id: "1" } });
```

Prismaのモデルとドメインのモデルの変換をこのラッパーで実現していて、
ドメインのモデルだけが変更されたときには、このあたりのコードを変更するだけで済むことが多いです。  

このWebアプリには、人気のお題などを表示する機能があり、集計を行う必要があります。  
集計のような処理はPrismaで書けそうになかったので、SQLを使って実装しています。  
デモをわかりやすくするために、リアルタイムで反映させたかったので、バッチ処理などではなく、アクセスが来るたびに集計をし直しています・・・。  
Cloud Runでは、バックグラウンドのタスクを実行するためのCloud Run ジョブという機能があり、そちらで集計を行ったほうが良いかもしれません。

このWebアプリで作りたいお題を見つけた場合は、GitHubリポジトリを登録して開発情報を作成し、開発に取り掛かることができます。  
このとき、ログインしているGitHubアカウントのパブリックリポジトリを選択できるような機能を実装しています。  
もともとは、このWebアプリからリポジトリ名や説明などを入力し、リポジトリを作成できるようにしていたのですが、
要求するGitHub OAuthのスコープが広すぎると感じたため、この機能を廃止したという経緯があります。  
リポジトリの作成だけのスコープがあればよかったのですが、公開リポジトリへのあらゆる操作が行えるようになってしまうため、廃止しました。

### フロントエンド

UIコンポーネントライブラリとして[Mantine](https://mantine.dev/)を使用しています。  
細かいスタイリング方法はMantineが推奨しているCSS modulesで行っています。  
スタイル情報にアクセスするためにCSS変数を使用しなければいけないのですが、補完が効かないのが辛かったです。  
一番つらかったのは、スタイルを変更するときに別ファイルを開く必要があることで、
頻繁にスタイルの変更のある開発には向いてないんじゃないかと思っていました。

お題やユーザーの検索では、検索条件をURLのsearch paramsに保存するようにしています。  
特定の条件での検索画面をブックマークに登録できたり、更新しても検索条件が失われないようになるため、大切なことだと思っています。  
そのまま使用すると型がつかないので、search paramsのzodスキーマを作り、`useURLParams`というhookに渡すことで、型がついた状態で操作できるようにしています。

アプリ開発のお題は、WYSIWIGエディタで書くことができます。  
Mantineの中にRich text editorという[tiptap](https://tiptap.dev/)をベースにしたコンポーネントがあったので、
それを使用して実装しています。  
Mantineでは、テキストを太字にしたり、リストを作成したりといった操作は組み込みで実装されていたのですが、
画像をアップロードして表示する機能が存在しなかったので作っています。  

#### バンドルサイズの削減

tiptapはバンドルサイズが大きく重たいです。MantineのRich text editorはtiptapに依存しているため、それを使用しているページのバンドルサイズは大きくなるのですが、なぜか使用していないページでもバンドルサイズが増加していることに気づきました。

MantineではコンポーネントごとのclassNameを上書きできる機能があり、それをテーマオブジェクトにまとめて、`MantineProvider`に渡すことができます。
コンポーネントのスタイルを上書きするのに`Component.extend()`のような関数を使用するのですが、ここでスタイルを設定するコンポーネントを読み込んでしまいます。

このプロジェクトでは、Next.jsの`_app.tsx`で`MantineProvider`を使用し、テーマオブジェクトを渡しているので、全てのページでtiptapが読み込まれ、バンドルサイズが肥大化していました。
そこで、Rich text editorをラップしたコンポーネントでスタイルを当てることによって、Rich text editorを使用していなページのバンドルサイズを100kBほど削減しました。

#### Mantineのメジャーアップデート対応

もともとはMantineのv6を使用していたのですが、途中でv7のアップデートがありました。  
変更がとても大きく、emotionの使用をやめてCSS Modulesで再実装されているみたいでした。  
インターフェースも変わっていて、emotionのcss propsのような方法が使えなくなっており、この時点でCSS Modulesに書き換えています。  
アップデートのあった時点で、コンポーネントは相当な数存在し、テストもまったく無かったので、動作確認もなしに一気に書き換えるのが難しそうと考えていました。  

コンポーネントを独立して動かせるようにすることで、動作を確認しながら更新していけるのではないかと考え、
Storybookを導入し、すべてのコンポーネントのStoryを作りました。  

APIアクセスはmswを立ててモックしています。  
msw-trpcという、mswを使ってtRPCのルートハンドラを型安全に実装できるライブラリを使用しつつ、
ルートとデータを渡すだけでルートハンドラを作成してくれるutilを作っています。  
`mockTrpcQuery(trpcMsw.user.search, [])`のようにしてハンドラを定義すると、
`trpc.user.search.useQuery(...)`が空の配列を返すようになります。

このようにしてコンポーネントのStoryを記述したあとに、バージョンアップを行いました。  
やはりコンポーネントをアプリと独立して動かせるというのは便利で、
全体としては壊れていても部分的にバージョンアップを進めることができました。  
すべてのコンポーネントにStoryがあるので、少なくともレンダリングでエラーが出ていないことを検出できるのが良かったです。  
少し気になったのは、Storybook上でコードが反映されるのに少し時間がかかってしまうことくらいでした。

## プロジェクトから学んだこと

### TypeScriptでのWebバックエンド

WebバックエンドをTypeScriptで書くことができるのかを確かめたくて始めたプロジェクトでもあるのですが、
結果として開発体験はとても良かったです。  

バックエンドとフロントエンドを繋ぐ部分に型がついているので、様々な負担が減りました。  
APIに型がついているため、覚えておかなければならない情報が減りますし、
バックエンドのコードを変更したときに型エラーになるので、修正も楽でした。  
型がない場合にはテストを書いてチェックするしかないですが、
そういった部分を事前の型チェックだけで不整合を検知できるので、
手間を省くことができると感じました。

また、ORMのPrismaもとても使いやすかったです。  
よくあるメソッドチェーンでクエリを発行するのではなく、
オブジェクト一つに様々な条件を含めるというAPIデザインのお陰で、簡単にラップした関数を作ることができました。  
メソッドチェーンは確かに使いやすいかもしれませんが、柔軟なカスタマイズが難しくなるのだと実感しました。  

### 命名

命名については、見ただけでわかりやすいが長い名前をモデルに付けるのは、逆に読みにくくなってしまうと考えるようになりました。

識別子の名前は読んだだけでわかりやすようにすると良いとよく言われています。  
僕は、プロジェクトのことを忘れた場合にも予備知識無しでコードを理解するために、読んだだけでわかる名前をつけるべきだと考えてきました。  
しかし、コードの様々な場所に存在する概念の名前が説明的で長いと、読むのが苦痛になってくることに気づきました。  
特にコードの中でモデルと呼ばれる概念は、様々な名前の中で使われることになるので、これが長いとモデルに関わる全ての名前が長くなります。  

今のコードでは、お題の開発情報を表すモデルとして`Dev`という単語を使用しています。  
これは十分に説明的ではなく、この名前だけを見ても具体的に何を表しているのか理解することは不可能だと思います。  
しかし、名前を見ただけでわかるように命名すると、`IdeaDevelopmentInfo`のようになり、文字数がとても多いです。  
このモデルに関連する全てにこの名前を含めると、文字数がさらに多くなります。  

たしかに、`Dev`という単語を見ただけでは、`IdeaDevelopmentInfo`を思い浮かべることはできないかもしれませんが、
一度覚えてしまうと、`Dev`は`Development`の略であるため、すぐに忘れてしまうことはないと考えています。  
`Dev`が何なのか理解することができたら、長くて説明的な名前を使用しているコードよりも、
短い名前を使用しているコードのほうが読みやすくなると僕は感じました。  

このように、モデルに長い名前をつけなければいけないときには、造語を作っても問題ないと考えています。  
その造語の質が良いと、短い文字数で多くの情報を伝えることができますが、センスが必要になりそうだなあと思っています。  
また、造語を作る場合は、定義している箇所にどんなモデルであるのかを説明するコメントを付けることも大切だと思います。
