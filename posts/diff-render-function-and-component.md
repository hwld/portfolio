> [!info]
> この投稿はReact 18を前提にしています。
> また、関数コンポーネントのことを指してコンポーネントと書いています。

Reactでは、様々なコンポーネントを実装して組み合わせることによってアプリケーションを作っていきます。
時にはJSXを変数に代入したり、JSXを返すrender関数を作ることもあります。
Reactは宣言的に書けて楽しくて便利ですよね。僕は好きです。

では、JSXを返すrender関数とコンポーネントは何が違うのでしょうか。
普段の開発では意識することはないかもしれませんが、
僕は[render hooksパターン](https://engineering.linecorp.com/ja/blog/line-securities-frontend-3)を実装するときに疑問に思いました。
どちらもJSXを返す関数ですが、`renderComponent()`や、`<Component />`のように異なった呼び出され方をします。
記事ではrender関数を使っていますが、コンポーネントではだめなのでしょうか。

この投稿では、これらの違いについて見ていきます。

## render関数・コンポーネントの定義

まず、用語が何を指すのかを簡単に定義します。

どちらにも共通して言えるのは、「JSXを返す関数」ということです。どちらもただの関数で、好きにネストしたり代入できます。
コンポーネントはコンポーネント内にネストすることは[推奨されていません](https://ja.react.dev/learn/your-first-component#nesting-and-organizing-components)が、
後述の説明によって理由は理解できると思います。

```tsx
// render関数
const render = () => {
  // render関数
  const renderB = () => {
    return <div>Render B</div>;
  };

  return <div>Render{renderB()}</div>;
};

// コンポーネント
const Component = () => {
  return <div>Component</div>;
};

// コンポーネント
const ComponentB = Component;

const App = () => {
  return (
    <>
      {render()}
      <Component />
      <ComponentB />
    </>
  );
};
```

render関数とコンポーネントはただの関数ですが、この投稿では呼び出し方によって区別します。
`render()`のように呼び出された関数をrender関数、JSXで`<Component />`のように呼び出された関数をコンポーネントと呼びます。

上の`<Component />`はrender関数のように`Component()`と呼び出すこともできるのですが、
コンポーネントは[先頭が大文字](https://ja.react.dev/reference/react/createElement#caveats:~:text=JSX%20%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E5%A0%B4%E5%90%88%E3%80%81%E7%8B%AC%E8%87%AA%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%82%92%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E3%81%99%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AB%E3%81%AF%E3%82%BF%E3%82%B0%E3%82%92%E5%A4%A7%E6%96%87%E5%AD%97%E3%81%A7%E5%A7%8B%E3%82%81%E3%82%8B%E5%BF%85%E8%A6%81%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99%E3%80%82)、または[ドット記法](https://ja.legacy.reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type)を使う必要があり、それ以外の場合には組み込みのHTMLタグとして扱われることになります。
そのため、`<render />`のように書いてしまうと存在しないHTMLタグが使われているといったエラーが発生します。
ドット記法が使われている場合には先頭を大文字にする必要はなく、例えば[motion](https://motion.dev/)というアニメーションのためのライブラリでは、
`<motion.div />`のようなコンポーネントが使われます。

## それぞれの挙動の違い

次はrender関数とコンポーネントでどのように挙動が異なっているのかを見ていきます。
実行できるコードを提示した後、なぜそのような挙動になっているのかを説明していきます。

### 検証のために使用するコード

まず、初回レンダリングが遅いコンポーネントを用意します。
初回レンダリングでは、再レンダリング時に行えるメモ化などの最適化ができないため、比較的重たいです。
また、コンポーネントのマウント時には、追加で様々な処理が行われるため、さらに時間がかかることもあります。
以降は「初回レンダリング+マウント」をまとめてマウントと呼ぶことにします。

```tsx
const SlowMount = () => {
  const firstRender = useRef(true);

  if (firstRender.current) {
    [...new Array(10000)].forEach(() => {
      console.log("delay");
    });
    firstRender.current = false;
  }

  return <div />;
};
```

このコンポーネントを使用したとき、render関数とコンポーネントの挙動に違いがでてきます。
挙動の確認には以下のようなコードを使用します。

```tsx
export default function App() {
  const [isRender, setIsRender] = useState(true);
  const [counter, setCouter] = useState(0);

  const Counter = () => {
    return (
      <div>
        <SlowMount />
        <button
          onClick={() => {
            setCouter((c) => c + 1);
          }}
        >
          +
        </button>
        <div>{counter}</div>
      </div>
    );
  };

  return (
    <div>
      <div>
        {isRender ? "render関数" : "コンポーネント"}
        <button
          onClick={() => {
            setIsRender((r) => !r);
          }}
        >
          switch
        </button>
      </div>
      {isRender ? Counter() : <Counter />}
    </div>
  );
}
```

このコードは、`SlowMount`コンポーネントを内部で使用している`Counter`を表示するものです。
`Counter`関数は`isRender`という状態を変更することによって、render関数とコンポーネントを切り替えることができます。
`App`コンポーネントは内部にカウンターの状態を持っており、`Counter`関数はその状態を表示・更新します。

### コンポーネントで発生する遅延

`App`コンポーネントをレンダリングして何度か+ボタンを押すと、render関数と比べてコンポーネントはカウントが表示されるまでに遅延があります。
+ボタンを押すたびに`console.log`が表示されていることから、再レンダリングではなく、アンマウントされてマウントが実行されていることがわかります。

この原因は、`Counter`関数が`App`コンポーネントのレンダリングのたびに異なる関数として作成され、別のコンポーネントとして扱われるからです。
別のコンポーネントとして扱われているので、アンマウントとマウントが発生します。
具体的には以下のような流れで処理されます。

1. `setCounter`が呼び出されると`App`コンポーネントが再レンダリングされる
2. 再レンダリング時に新しい`Counter`関数が作成される
3. Reactは前回のレンダリングで作成された`Counter`関数と今回の`Counter`関数を別のコンポーネントとして認識する
4. 前回の`Counter`がアンマウントされ、新しい`Counter`がマウントされる

このように、`Counter`関数が毎回新しく生成されることで、レンダリングのたびにマウントが発生します。
一見すると`Counter`は同じコンポーネントなのですが、Reactは別のコンポーネントとして扱います。

Reactでは`useCallback`を使って関数をメモ化することもできますが、今回のケースだと依存リストに`counter`を含める必要があるので、
`counter`を変更すると結局マウントが発生することになります。
また、`SlowMount`に`React.memo`を使用しても、親の`Counter`がアンマウントされるので意味がないですし、
`Counter`関数に`React.memo`を使用しても、何度も`React.memo`が呼ばれるだけなので異なる関数が返ってきます。

また、コンポーネントが状態を持っている場合、アンマウントとマウントによってリセットされるという問題もあり、バグに繋がる可能性があります。

### render関数で遅延が発生しない理由

ここまででレンダリングのたびに異なる`Counter`関数が作成されるため、Reactが別のコンポーネントだと認識してしまい、
アンマウントとマウントが発生することはわかったと思います。
しかし、`Counter`関数がレンダリングのたびに異なっているにもかかわらず、render関数では`SlowMount`がアンマウントされません。

render関数で`SlowMount`がアンマウントされないのは、アンマウントやマウントがコンポーネントに固有のものだからです。
`SlowMount`がアンマウントされたのは、親である`Counter`コンポーネントがアンマウントされたからで、render関数としての`Counter`にはマウントもアンマウントもありません。

ReactはJSXの`<Counter />`という記法や`createElement`関数によってコンポーネントからReact要素を生成し、最終的に画面に描画されます。
コンポーネント以外でも、`div`や`p`などのHTMLタグからReact要素を生成し、画面に描画することもできます。

> [!info]
> JSXである`<Component />`というコードは、TypeScriptやBabelといったツールによって`_jsx(Component, ...)`というコードに変換されます。
> React 17以前では上にある`createElement`が使われていましたが、[パフォーマンス改善や簡略化](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation)のために`_jsx`が使われるようになりました。

`Counter()`と呼び出す場合、`Counter`関数はコンポーネントではないので、`Counter`関数内部にあるJSXがReact要素として生成されます。
`SlowMount`はトップレベルで作られた関数なのでレンダリング間で同一であり、`App`コンポーネントが再レンダリングされてもアンマウントされません。

## まとめ

JSXを返す関数について、

- `render()`のように呼ばれるものを**render関数**
- `<Component />`のように呼ばれるものを**コンポーネント**

とした場合、マウント・アンマウントはコンポーネントに固有の概念であり、

- レンダリング間でコンポーネントが同一ではない場合、アンマウントされる
- render関数はコンポーネントではないため、アンマウントされない
