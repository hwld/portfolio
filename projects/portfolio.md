## 使用した技術と実装の詳細

- TypeScript
- Next.js (Static Exports)
- Firebase Hosting

プロジェクト詳細はMarkdownで書いて、ビルド時にhtmlに変換してページにしています。  
Markdownのファイル名から、`/projects/[fileName]`というページを生成しています。  
プロジェクトのデータはTypeScriptの配列として持っており、ビルド時にMarkdownファイルが存在しない場合にはエラーで落とし、Markdownが存在しなかったり、存在しないプロジェクトのMarkdownを作ってしまわないようにしています。
