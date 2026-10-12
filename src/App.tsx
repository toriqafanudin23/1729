import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CatalogPage from "./pages/CatalogPage";
import NotFoundPage from "./pages/NotFoundPage";
import SimulationPage from "./pages/SimulationPage";
import ShopLanding from "./pages/shop/ShopLanding";
import LatihanLanding from "./pages/latihan_soal/LatihanLanding";
import { LatihanRoute } from "./pages/latihan_soal/LatihanPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const canonicalUrl = new URL(pathname, "https://1729.blog").toString();
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const openGraphUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');

    if (canonical) canonical.href = canonicalUrl;
    if (openGraphUrl) openGraphUrl.content = canonicalUrl;
  }, [pathname]);

  return null;
}

function PageLoading() {
  const { pathname, search } = useLocation();
  const route = `${pathname}${search}`;
  const [isLoading, setIsLoading] = useState(true);
  const startedAt = useRef<number | null>(performance.now());
  const previousRoute = useRef(route);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      if (!link || link.hasAttribute("download") || link.target === "_blank") return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      startedAt.current = performance.now();
      setIsLoading(true);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (previousRoute.current !== route) {
      previousRoute.current = route;
      if (startedAt.current === null) {
        startedAt.current = performance.now();
        setIsLoading(true);
      }
    }

    if (!isLoading) return;

    const elapsed = performance.now() - (startedAt.current ?? performance.now());
    const timer = window.setTimeout(() => {
      startedAt.current = null;
      setIsLoading(false);
    }, Math.max(0, 500 - elapsed));

    return () => window.clearTimeout(timer);
  }, [isLoading, route]);

  if (!isLoading) return null;

  return (
    <div className="app-loading" role="status" aria-live="polite">
      <div className="app-loading__content">
        <span className="app-loading__brand" aria-hidden="true">1729</span>
        <span className="app-loading__spinner" aria-hidden="true" />
        <span className="app-loading__label">Memuat halaman</span>
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
      <PageLoading />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulasi" element={<CatalogPage />} />
        <Route path="/simulasi/:slug" element={<SimulationRoute />} />
        <Route path="/latihan" element={<LatihanLanding />} />
        <Route path="/latihan/:slug" element={<LatihanRoute />} />
        <Route path="/toko" element={<ShopLanding />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

