import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Top100 from "./pages/Top100";
import Tierlists from "./pages/Tierlists";
import TierlistDetail from "./pages/TierlistDetail";
import Customs from "./pages/Customs";
import LiveMatch from "./pages/LiveMatch";
import Setup from "./pages/Setup";
import Veto from "./pages/Veto";
import VetoAdmin from "./pages/VetoAdmin";
import VetoCaptain from "./pages/VetoCaptain";
import VetoSpectator from "./pages/VetoSpectator";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/top100" element={<Top100 />} />
          <Route path="/tierlists" element={<Tierlists />} />
          <Route path="/tierlists/:id" element={<TierlistDetail />} />
          <Route path="/customs" element={<Customs />} />
          <Route path="/live" element={<LiveMatch />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/veto" element={<Veto />} />
          <Route path="/veto/admin" element={<VetoAdmin />} />
          <Route path="/veto/captain/:id/:slot/:token" element={<VetoCaptain />} />
          <Route path="/veto/:id" element={<VetoSpectator />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
