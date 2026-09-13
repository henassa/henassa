import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Selections from "./pages/Selections";
import SelectionDetail from "./pages/SelectionDetail";
import Customs from "./pages/Customs";
import LiveMatch from "./pages/LiveMatch";
import LiveMatchAdmin from "./pages/LiveMatchAdmin";
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
          <Route path="/selections" element={<Selections />} />
          <Route path="/selections/:id" element={<SelectionDetail />} />
          <Route path="/customs" element={<Customs />} />
          <Route path="/live" element={<LiveMatch />} />
          <Route path="/live/admin" element={<LiveMatchAdmin />} />
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