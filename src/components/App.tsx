import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Layout } from "./Layout";
import { Profile } from "./Profile";

// TODO:レスポンシブ対応
function App() {
  return (
    <Layout>
      <Header />
      <Profile />
      <Content className="flex-grow" />
      <Footer />
    </Layout>
  );
}

export default App;
