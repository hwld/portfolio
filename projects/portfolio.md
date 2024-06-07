## 使用した技術と実装の詳細

- TypeScript
- Next.js (Static Exports)
- Firebase Hosting

プロジェクト詳細はMarkdownで書いて、ビルド時にhtmlに変換してページにしています。  
Markdownのファイル名から、`/projects/[fileName]`というページを生成しています。  
プロジェクトのデータはTypeScriptの配列として持っており、ビルド時にMarkdownファイルが存在しない場合にはエラーで落とし、Markdownが存在しなかったり、存在しないプロジェクトのMarkdownを作ってしまわないようにしています。

あとは下部にあるナビゲーションバーのアニメーションにこだわっています。  
vercelのdashboardにあるナビゲーションバーを触っていて楽しいと感じたので、真似しました。
もともとはframer-motionの[Layout Animations](https://www.framer.com/motion/layout-animations/)
という機能を使っていたのですが、モバイルでスクロールしているときの挙動がおかしかったので、
`onPointerEnter`を使用してDOMの情報を取得し、それを使ってレンダリングしています。  
