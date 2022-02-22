import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Layout } from "./Layout";
import { Hero } from "./Hero";

// TODO:レスポンシブ対応
function App() {
  return (
    <Layout>
      <Header />
      <Hero />
      <Content className="flex-grow" />
      <Footer />
    </Layout>
  );
}

export default App;
