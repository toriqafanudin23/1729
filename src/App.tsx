import { lazy, Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SimulationPage = lazy(() => import("./pages/SimulationPage"));
const ShopLanding = lazy(() => import("./pages/shop/ShopLanding"));
const LatihanLanding = lazy(() => import("./pages/latihan_soal/LatihanLanding"));
const LatihanRoute = lazy(() => import("./pages/latihan_soal/LatihanPage").then((m) => ({ default: m.LatihanRoute })));
const SlidesLandingPage = lazy(() => import("./slides/pages/SlidesLandingPage"));
const SlidePresentPage = lazy(() => import("./slides/pages/SlidePresentPage"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

function PageLoading() {
  return (
    <div className="app-loading" role="status" aria-live="polite">
      <div className="app-loading__content">
        <div className="app-loading__chart" aria-hidden="true">
          <span className="app-loading__brand">1729</span>
          <span className="app-loading__chart-label">y = f(x)</span>
          <svg viewBox="0 0 240 120" focusable="false">
            <path className="app-loading__axis" d="M24 12v88h204M24 76h204M76 12v88M128 12v88M180 12v88" />
            <path className="app-loading__curve" d="M26 86 C52 84 56 30 91 34 S130 96 157 69 187 22 226 26" />
            <circle className="app-loading__point" cx="157" cy="69" r="4" />
          </svg>
        </div>
        <span className="app-loading__label">Memuat halaman<span className="app-loading__dots" aria-hidden="true">…</span></span>
      </div>
    </div>
  );
}

function SimulationRoute() {
  const { slug } = useParams();
  return <SimulationPage slug={slug} />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Halaman login sudah dihapus; tautan lama dialihkan ke beranda. */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/auth/verify" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/simulasi" element={<CatalogPage />} />
          <Route path="/simulasi/:slug" element={<SimulationRoute />} />
          <Route path="/latihan" element={<LatihanLanding />} />
          <Route path="/latihan/:slug" element={<LatihanRoute />} />
          <Route path="/toko" element={<ShopLanding />} />
          <Route path="/slides" element={<SlidesLandingPage />} />
          <Route path="/slides/:slug" element={<SlidePresentPage />} />
          <Route path="/slide" element={<Navigate to="/slides" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;

