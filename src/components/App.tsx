import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Layout } from "./Layout";

// TODO:レスポンシブ対応
function App() {
  return (
    <Layout>
      <Header />
      <Hero />
      <Content className="mt-10" />
      <Footer />
    </Layout>
  );
}

export default App;
