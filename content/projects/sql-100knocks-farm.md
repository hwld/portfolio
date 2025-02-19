---
title: sql-100knocks-farm
createdAt: 2025-01-24
tags: []
imageSrc: /screenshots/sql-100knocks-farm.png
summary: Denoを使って作った、データサイエンス100本ノックのSQLを解くためのプロジェクトです。
githubUrl: https://github.com/hwld/sql-100knocks-farm
---

## 概要

[データサイエンス100本ノック](https://github.com/The-Japan-DataScientist-Society/100knocks-preprocess)のSQLを解くためのプロジェクトです。

このプロジェクトはGitHubにpushされており、クローンして問題を解くことができます。
プロジェクトの中には、問題文を含む空のSQLファイルが含まれているディレクトリ、問題の解答データ、CLIなどが含まれています。
問題文に従ってSQLを書いたあとに、CLIを使ってSQLを実行し、解答データと一致するかを自動で確認することができます。

CLIには、指定された問題のSQLファイルを開くコマンドや、現在開いているSQLファイル実行するコマンドなどがあります。
問題を連続して解けるように、次の問題や前の問題、特定の問題のファイルを開くようなコマンドも存在します。
設定ファイルにSQLを書くのに使用したいエディタのコマンドを設定することで、指定されたエディタでSQLのファイルを開くことができます。

このCLIはワンショット？のCLIではなく、インタラクティブなCLIになっています。
CLIを起動するとメインのプロンプトが表示され、そこで`start <問題の番号>`や`help`のようなコマンドを受け付けます。
`start <問題の番号>`を実行すると、指定された問題に対するアクションを実行するためのプロンプトが表示されるような流れになっています。

問題を解く流れは以下のようになります。

1. CLIを起動して、`start <問題の番号>`を入力する
1. 問題文を含むSQLファイルが開くので、SQLを書く
1. CLIで`run`を入力し、SQLを実行して解答と一致するかを確認する
1. 失敗した場合は書いたSQLの実行結果と解答データが保存されたファイルが開くので、それを参考にSQLを修正したあとに`run`を実行する
1. 成功した場合、`next`や`prev`、`move <問題の番号>`で次の問題に進む

このプロジェクトには解答例であるhtmlファイルから問題セットを生成し直すスクリプトも含まれています。
CLIには問題を繰り返し解くような機能は含まれていないのですが、このスクリプトを実行することで、書いたSQLファイルをリセットして解き直すことができます。

## 使用した技術

- Deno
- TypeScript
- zod
- [Cliffy](https://cliffy.io/)
- [neverthrow](https://github.com/supermacro/neverthrow)

## 実装の詳細

### CLIの初期化

CLIを実行すると、まず`docker compose up -d`コマンドを実行して、プロジェクトのディレクトリに含まれる`compose.yml`をもとにPostgreSQLを立ち上げます。
その後設定ファイルから問題が含まれるディレクトリや使用するエディタのコマンドなどを読み込みます。

設定ファイルはjsonで書かれており、それを読み込んで`zod`で作成した設定ファイルのスキーマをもとにパースします。
設定データはグローバルに使用したかったためシングルトンで実装したのですが、テストのことを考えるとDIコンテナのような仕組みがあったほうが良いかもしれません。
Node.jsに実装されている`AsyncLocalStorage`なども使えると思います。

設定ファイルには使用するエディタのコマンドや、２つのファイルを比較して表示するためのオプションなどを設定できます。
デフォルトだと僕が普段使っているVSCode Insidersのコマンドである`code-insiders`が設定されていて、比較するためのオプションは`-d`になっています。
2つのファイルを比較して表示する機能は、不正解だった場合に書いたSQLの実行結果が保存されているファイルと解答データを開くために使用しています。

設定を取得するためには、exportされている`Config`クラスのインスタンスを使用します。

```ts
export const config = new Config();

config.load();
config.get("editorCommand");
config.get("diffOption");
config.get("100knocksDir")
```

`zod`でスキーマを定義しているため、`Config.get()`で指定できる設定は補完が効きます。

### コマンドのパースと実行

コマンドをパースして実行するために、[Cliffy](https://cliffy.io/)というDenoのライブラリを使用しています。
コマンド名と対応する処理を複数渡してコマンドのインスタンスを作成し、入力として受け取った文字列をパースしてコマンドに対応する処理を実行できます。

コマンドは入れ子に対応しているため、コマンドごとにファイルを分割することもできます。

```ts
const helpCommand = new Command().action(() => { /* ... */ });
const exitCommand = new Command().action(() => { /* ... */ });
const startCommand = new Command()
    .arguments("<problemNo:number>")
    .action((_, problemNo) => {
        // ...
    });

while(true) {
    const command = new Command()
        .command("help", helpCommand)
        .command("exit", exitCommand)
        .command("start", startCommand);

    const input = prompt("skf>");
    await command.parse(input.split(" "));

    // ...
}
```

このプロジェクトでは、上のように各コマンドを別のファイルに分割してコマンドを実装しています。
それぞれのコマンドで外からデータを受け取りたいときには、コマンドを返す関数として定義し、引数でデータをもらっています。

このライブラリはワンショット型のCLIを想定しているみたいで、コマンドのパースに失敗すると`Deno.exit()`が呼ばれます。
このプロジェクトではエラーが起きてもできるだけ次のコマンドの入力を受け付けるようにしたかったため、`.noExit()`で抑制しています。

エラーハンドリングは、想定していないエラーや復旧できなそうなエラーには例外を使用し、それ以外のエラーは[neverthrow](https://github.com/supermacro/neverthrow)の`Result`を使用しています。

neverthrowには様々なAPIがあるのですが、`Result`クラスと`Result.isErr()`・`Result.isOk()`、Resultクラスを生成するための`ok()`と`err()`のみを使用しています。
無理に関数型のような書き方はせずに、関数の戻り値にエラーを含めて絞り込みができるようにするための機能をシンプルに使用しています。

### SQLの実行と結果の比較

`start <問題の番号>`コマンドを実行すると、指定されたエディタで問題のSQLファイルが開かれます。
そのファイルにはコメントとして問題文が書かれているため、それを満たすようなSQLを書いたあと、`run`コマンドを実行するとSQLが実行できます。

CLIの起動時に`docker compose`でPostgreSQLを立ち上げているので、そこに向けてクエリを発行します。
データベースの内容が変更されないように、コマンド実行前にトランザクションを貼って、実行後にロールバックしています。

SQLの実行結果は`{ columns: string[]; rows: string[][] }`のような型に変換して解答と比較します。
問題の解答データはCSVファイルとして保存されているので、比較する際にそのファイルをパースして列と行を取得します。
Denoは標準ライブラリにcsvのパーサーがあって便利だなぁと思っていました。

実行結果を比較する際には、列名や列の順番は一致していなくても良いようにしました。
まず実行結果と解答データの一行目を取得して値を比較し、対応する列のindexのペアを取得したあと、それを使用して全体を比較しています。
実行結果や解答データの一行目に同じ値が複数ある可能性もあるため、すべてのペアの組み合わせを取得し、それぞれで比較しています。

SQLの実行後には、実行結果と解答データそれぞれをテーブル形式にフォーマットしてファイルに保存します。
これは、Node.jsの`console.table()`が出力する形式の文字列をそのまま利用しています。
Denoにはないのですが、Node.jsには`Console`クラスというものがあり、そのクラスを作成する際に標準出力を指定できます。
ここに、書き込まれた際に文字列を追記していくWritableStreamを作って渡すと、`console.table()`の呼び出しで文字列を取得できます。

実行結果と解答データが一致しなかった場合には、それぞれのファイルを開きます。
2つのファイルを比較するオプションが渡されていた場合には、それを使用します。

## 学び

とにかくDenoの開発者体験が良かったです。
TypeScriptを書くために必要な準備が一切なく、コードを書いてコマンドを入力するだけで実行できてとても便利でした。
また、最近はNode.jsもそうなのですが、テストを書くための準備もほとんど必要なく快適でした。

標準ライブラリもNode.jsと比べると様々なものが含まれており、csvのパーサーや、stableではないですがloggerもあります。
最近はランタイムにOpenTelemetryを組み込むような取り組みもされているようです。
僕はサードパーティに依存するのは少しだけ怖いので、標準ライブラリでサポートしてくれる機能が多いのは嬉しいなぁと感じます。

また、新しい概念の発見でコードが一気に綺麗になるという感覚も掴めました。
ある機能を実現するために様々なデータをバラバラに扱っていると、それらを一時的にまとめたり分割して処理するコードで複雑になりがちです。
そういったデータをまとめるための概念を見つけ、そのモデルという単位でデータをやり取りすることでコードがシンプルになると感じました。

コードを書く前から認識している概念もありますが、発見しにくい概念もあります。
例えば、現実世界に似たような概念が存在する場合や、プログラミングにおいて一般的に使われる概念はコードを書く前の段階から認識できると思います。
一方で、コードを書く中で初めて必要になる、より特定のケースに特化した概念もあります。

発見しにくい概念は、コードの複雑性に向き合うことで初めて見つけることができると思うので、複雑性をただ受け入れるというスタンスは避けないといけないと感じました。
また、コードの変更が容易ではないと、概念をモデルとしてコードに適用するのが難しくなるため、変更容易性の重要性も再認識しました。
