import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CatalogPage from "./pages/CatalogPage";
import NotFoundPage from "./pages/NotFoundPage";
import SimulationPage from "./pages/SimulationPage";
import LatihanLanding from "./pages/latihan_soal/LatihanLanding";
import { LatihanRoute } from "./pages/latihan_soal/LatihanPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function SimulationRoute() {
  const { slug } = useParams();
  return <SimulationPage slug={slug} />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulasi" element={<CatalogPage />} />
        <Route path="/simulasi/:slug" element={<SimulationRoute />} />
        <Route path="/latihan" element={<LatihanLanding />} />
        <Route path="/latihan/:slug" element={<LatihanRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

