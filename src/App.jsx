import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Selections from "./pages/Selections";
import SelectionDetail from "./pages/SelectionDetail";
import Customs from "./pages/Customs";
import Setup from "./pages/Setup";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/selections" element={<Selections />} />
          <Route path="/selections/:id" element={<SelectionDetail />} />
          <Route path="/customs" element={<Customs />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}