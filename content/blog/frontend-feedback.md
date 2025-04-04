---
isExternal: true
url: https://zenn.dev/hwld/articles/160086b738b78e
title: 「処理の状況を伝える」Webフロントエンド
createdAt: 2024-12-31
---

僕は趣味でWebフロントエンド開発を行っています。
始めたての頃は、とにかく動くものが作れることに達成感がありました。
フォームに文字を入力してボタンをクリックするとデータが保存されたり、アイテムをクリックすると詳細画面に遷移したりと、それだけで楽しめました。
しかし様々なものを作っていると、それだけでは満足できずに品質を意識するようになってきます。

この投稿は、処理の状況を伝えることがWebフロントエンドの品質向上において重要なのではないかという考えと、処理の状況を伝える方法を自分の理解のためにまとめたものです。

## Webフロントエンドの品質とは何か

ソフトウェアの品質向上のためには、**品質特性**(品質を評価する基準)を考える必要があります。

まず、品質をユーザーから見える**外部品質**とユーザーから見えない**内部品質**に分けてみます。
外部品質はソフトウェアの価値を提供するために必要であり、内部品質はソフトウェアの価値を維持するために必要です。
外部品質特性として、仕様通りに動作する・バグが少ない・高速に動作する・使いやすいなどがあります。
内部品質特性としては、コードが変更しやすい・コードが読みやすいなどがあります。

ここでは品質特性のうち「使いやすい」の側面の一つである、「**ユーザーがストレスなく使えるか**」について見ていきます。
この「使いやすい」という特性は**ユーザビリティ**と呼ばれ、その評価基準として満足度が存在します。
ユーザーが使いやすいかどうかを表しているのは満足度のことであり、使っていて無駄なストレスがかかる場合には満足度は下がると考えています。

> [!note]
ユーザビリティを評価するときには、ソフトウェアの品質以外に利用の目的や利用の状況も必要になってくるため、厳密にはソフトウェアの品質特性として含められないかもしれません。
ここでは単純にするため、ソフトウェアの品質特性としてユーザビリティを含めていますが、ソフトウェアの品質だけがユーザビリティを左右するわけではないことを意識する必要はあります。

Webフロントエンドは、「ユーザーがストレスなく使えるか」に大きな影響を与えます。
バックエンドはユーザーと直接対話しないため、ユーザーのストレスを直接的に軽減できる要素は限られます。
一方で、フロントエンドはUIを通じてユーザと直接対話するため、ユーザーのストレスを軽減できる様々な可能性を秘めています。
バックエンドのパフォーマンスが悪くても、フロントエンドの工夫次第ではユーザーのストレスを緩和できる可能性が高いです。

## 品質を損なう「処理状況の不透明さ」

Webアプリがユーザーに与えるストレスの要因は多岐にわたりますが、ここでは「**処理状況の不透明さ**」について考えていきます。

「**処理状況の不透明さ**」とは、処理が動いているのか止まっているのか、成功か失敗か、失敗なのかデータが無いのかなどの区別がつかないことです。
これらは開発中に意識しないと気づきにくいです。例えば開発環境は高速なため処理途中の時間はあまり存在しませんし、
開発時には意識しないと遭遇しないエラーもあります。

処理状況が不透明な場合、ユーザーは何が起きているかを把握するのが面倒なためにストレスを感じやすいと考えられます。
例えばボタンをクリックしても画面に何も変化がない場合、ユーザーに「処理が行われているのか？」という不必要な思考を強いることになります。
また、処理が完了しても画面に何も変化がない場合、ユーザーは「処理が完了したのか？」という不安を抱えながら次の行動を取る必要が出てきます。
そのため、処理状況の不透明さはユーザーの負担を大きくし、ストレスの要因となります。

## 処理の分類 - QueryとMutation

不透明な処理状況への対処を考える前に、Webアプリにおいて処理とはどのようなものを指すのかについて考えていきます。

ここでは、Webアプリの処理を**Query**(データの取得)と**Mutation**(データの更新)に分類します。
QueryやMutationは同期的に行われる場合もあれば、非同期的に行われる場合もあります。
例えばメモリの操作のように比較的短時間で完了する処理は同期的に行われることが多いです。
一方で、ネットワークI/Oのように完了までに時間がかかる処理は非同期的に行われることが多いです。

Webアプリの処理状況が不透明というのは、QueryやMutationの状況が不透明ということになります。
データが取得中・更新中なのか、データの取得や更新は成功しているのか、データの取得が失敗しているのか・取得したデータが空だったのかなどの区別がつかないということです。

## フィードバックで「処理状況の不透明さ」を解消する

処理状況の不透明さを解消するためには、ユーザーに適切な**フィードバック**をUIを通じて提供する必要があります。
これはユーザーに処理の状況を伝えるということであり、ユーザーがシステムの状況を推測なしに理解し、不安なく操作を進めるために必要です。

フィードバックによく使われるUIとして**トースト**があります。
トーストは画面上に一時的なメッセージを表示するためのUIで、多くの場合は画面の隅に表示され、一定時間後に消えます。
メッセージの他にアクションを実行するボタンが含まれていたり、スワイプで消せるようになっていたりと様々なバリエーションが存在します。

![トースト](/images/frontend-feedback/toast.png)

---

フィードバックは、ユーザーに伝えるべき処理の状態に応じて、適切なUIを選択する必要があります。
ここでは処理の状態を以下の4つに分類し、それぞれのUIについて簡単に見ていきます。

- **処理中** (Pending)
- **失敗** (Error)
- **成功** (Success)
- **空のデータ** (Empty)

### 「処理中」のフィードバック

処理中(Pending)とは、Query/Mutationが実行中であることを表す状態です。
例えばサーバーからデータを取得するためにネットワーク通信を行っている最中や、サーバーにデータを送信して更新処理を行っている最中などが該当します。

処理中であることを伝えるUIとしては**プログレスインジケーター**が使われることが多いです。
プログレスインジケーターはどれだけ時間を要するかを明確に伝える確定タイプと、伝えない未確定タイプに分類できます。
プログレスインジケーターの中には、ライン型の**リニアインジケーター**や円型の**サーキュラーインジケーター**などがあります。

![インジケーター](/images/frontend-feedback/indicator.png)

---

Queryの処理中を伝えるUIのパターンには、主に以下の2つがあります。

1. **データを表示する領域にインジケーターを配置:**  
Queryの処理中は、読み込み後にデータが表示される領域にインジケーターを配置するのが基本です。
例えば、複数のデータを読み込んでリスト表示する場合、リストを表示する領域にインジケーターを表示するUIがよく見られます。
また、読み込まれるデータのUIと似せた形のスケルトンスクリーンと呼ばれるインジケーターも効果的です。

1. **画面上部にインジケーターを配置:**  
Query後にデータを表示する領域がまだ描画されていない場合には、画面上部にリニアインジケーターを配置することがあります。
例えば、リンクをクリックしてQuery後に遷移するような場合、データが表示される領域がまだ描画されていないため、このパターンが使われます。

![query-pending](/images/frontend-feedback/query-pending.png)

---

Mutationの処理中を伝えるUIのパターンには、主に以下の2つがあります。

1. **更新のきっかけとなるUIにインジケーターを配置:**  
Mutationの処理中は、更新のきっかけとなるUIにインジケーターを配置することが多いです。
例えばフォームに必要な情報を入力して作成ボタンのクリックでデータを作成する場合、作成ボタンの中にインジケーターを配置するUIがよく見られます。
また、処理中にボタンを無効にして、ユーザーが誤って何度もクリックできないように制御するケースも一般的です。

1. **トーストにインジケーターを配置:**  
更新のきっかけとなるUIが存在しない場合には、トーストで伝えることができます。
トーストにメッセージと合わせてインジケータを配置するUIがよく見られます。

![mutation-pending](/images/frontend-feedback/mutation-pending.png)

---

### 「失敗」のフィードバック

失敗(Error)とは、Query/Mutationが失敗したことを表す状態です。
例えばサーバーからデータを取得しようとした際にネットワークエラーが発生した場合や、サーバーに不正なデータを送信し更新処理が失敗した場合などが該当します。

失敗を伝えるUIの基本はエラーメッセージです。
エラーメッセージによって何が失敗したのか、なぜ失敗したのかなどを具体的にユーザーに伝えることができます。
エラーメッセージの表示方法には様々なバリエーションがありますが、基本的にエラーメッセージによって失敗を伝えます。
エラーメッセージは失敗を伝える以外に、次の行動を促すこともできます。

エラーメッセージは、ユーザーが理解しやすいようにわかりやすく書くことが重要です。
状況を適切に伝えるためには、利用を想定しているユーザー層に合わせた言葉を選ぶ必要があります。
情報を詰め込みすぎると逆にユーザーを混乱させてしまう可能性があるため、どこまで伝えるかを考える必要もあると思います。

Queryの失敗を伝えるUIのパターンには、主に以下の2つがあります。

1. **データを表示する領域にエラーメッセージを配置:**  
Queryの失敗を伝えるときには、読み込み後にデータを表示する領域にエラーメッセージを含むUIを配置することが一般的です。
例えば複数のデータを読み込んでリストとして表示する場合、リストを表示する領域にエラーメッセージを配置するUIがよく見られます。

1. **エラーページを表示:**  
Query後にデータを表示する領域がまだ描画されていない場合には、エラーページを表示することができます。
例えば、削除済みのアイテム詳細画面に遷移しようとした際に、アイテム情報を取得するQueryが失敗した場合、404エラーのページなどを表示することができます。

![query-error](/images/frontend-feedback/query-error.png)

---

Mutationの失敗を伝えるUIのパターンには、主に以下の2つがあります。

1. **エラーが発生したUIの近くにエラーメッセージを配置:**  
失敗の原因がわかっていて、エラーが発生しているUIが特定できる場合には、その近くにエラーメッセージを配置できます。
例えばテキストフィールドの不正な文字によって失敗している場合、そのテキストフィールドの近くにエラーメッセージを配置するUIがよく見られます。

1. **トーストにエラーメッセージを配置:**  
エラーが発生しているUIが特定できなかったり、レイアウトの問題がある場合には、トーストにエラーメッセージを配置することができます。

![mutation-error](/images/frontend-feedback/mutation-error.png)

---

### 「成功」のフィードバック

成功(Success)とは、Query/Mutationが成功したことを表す状態です。
例えばサーバーからのデータを読み込めた場合や、データの削除・更新・削除処理が完了した場合などが該当します。

Query/Mutationの成功を伝えるUIのパターンには、主に以下の2つがあります。

1. **自然なUIの変化:**  
成功の状態は、フィードバックのためのUIというよりも、自然なUIの変化によって伝えることが多いです。
例えばQueryは、データの読み込みが完了した際に画面上にデータが表示されることが多いため、それによって成功を伝えています。
また、Mutationのうち作成や削除は、処理が完了するとデータが画面に表示されたり、データが画面から削除されることが多いため、それによって成功を伝えています。

1. **トーストにメッセージを配置:**  
QueryやMutationによって自然にUIが変化しない場合には、トーストを使用して状態を伝えることができます。
例えばバックグラウンドでデータの読み込みを行っている場合や、画面に表示されていないデータを更新した場合などが該当します。

![success](/images/frontend-feedback/success.png)

---

### 「空のデータ」のフィードバック

空のデータ(Empty)とは、Queryが取得したデータが空であることを表す状態です。
例えば、ユーザーが検索を行った際に該当するデータが一つも存在しない場合が該当します。

空のデータを伝えるためには、読み込み後にデータを表示する領域にメッセージを配置するのが一般的です。
例えば「該当するデータが存在しません」のようなメッセージが使われます。
また、データが存在しないことを視覚的に表すアイコンや、「検索条件を変えてみてください」や「新しいデータを登録してください」のような次の行動を促すテキスト、
データを登録するためのボタンなどを組み合わせることもあります。

![empty](/images/frontend-feedback/empty.png)

---

空のデータであることをユーザーに伝えなかった場合、データの取得に失敗しているのか、空のデータを取得したのかの区別がつかないため、ユーザーがストレスを感じる可能性があります。

## さいごに

Webフロントエンドの品質向上のためには、処理の状況をユーザーに伝える事が重要なのではないかという考えを書きました。

処理状況のフィードバックは見落としやすいため、開発時には常に意識しておくべきだと感じました。
開発環境では処理中のフィードバックが必要ないほどサーバーとの通信は高速ですし、ネットワーク通信関連のエラーはあまり発生しません。
これらを意識して開発時にテストを行うことでWebフロントエンドの品質を向上させることができると思います。

また、ここでは各状況を伝えるためのUIを簡単にしか説明していません。
更に品質を向上させるためには、フィードバックをただ行うだけではなく、適切なUIを選択する必要があります。
そのためには、UIのパターンを覚えるだけでなく、ユーザーの視点に立って利用状況を理解し、最適なUIを適宜考えていくことが大切になります。

この投稿が、Webフロントエンドの品質向上の役に立つことを願っています。

## 参考資料

- [つながる世界のソフトウェア品質ガイド](https://www.ipa.go.jp/archive/publish/qv6pgp0000000wkj-att/000055008.pdf)
- [プログレスインジケータの役割とは？デザイナーのためのインジケータ設計アイデア](https://goodpatch.com/blog/progress-indicator)
- [Open UI](https://open-ui.org/)
