## 概要

Next.jsを使用して作った、数を数えるカウンターを複数作ることのできるWebアプリです。  
カウンターは初期値や増減量、最大値、最小値を設定することができます。

![add-counter-screen](/screenshots/countany-add-counter-dialog.png)

初めてWebバックエンドを作ったプロジェクトで、シンプルなCRUDを実装しています。  
ログインせずにローカルにカウンターを作成することができ、Googleアカウントでログインすると、そのカウンターがアカウントに登録されるようになっています。  

一定時間アクセスがないとMongoDB Atlasが落ちてログインすることができなくなります。  
いろいろなものが古すぎて、今はデータベースにアクセスすることができないので、ログインすることはできません・・・。

## 使用した技術

- TypeScript
- Next.js
- Material UI
- NextAuth.js
- MongoDB
- Vercel

RDBを使ってみたかったので無料のherokuのpostgreSQLを使おうと思ったのですが、
コネクション数の制限が厳しかったため、MongoDB Atlasとmongooseを使用しています。  
connection poolerについては覚えていないのですが、当時はherokuではPgBouncerなどのpoolerは無料で使えなかった気がします。  
