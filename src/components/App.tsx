import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-neutral-800 text-neutral-50 flex flex-col">
      <Header />
      <Hero />
      <Content className="flex-grow" />
      <Footer />
    </div>
  );
}

export default App;
