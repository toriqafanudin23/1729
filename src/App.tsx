import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import CatalogPage from "./pages/CatalogPage";
import NotFoundPage from "./pages/NotFoundPage";
import SimulationPage from "./pages/SimulationPage";

const normalizePath = (pathname: string) => {
  return pathname.replace(/\/+$/, "") || "/";
};

function App() {
  const [path, setPath] = useState<string>(() => normalizePath(window.location.pathname));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [path]);

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) return;

      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) return;

      const nextPath = normalizePath(target.pathname);
      if (nextPath === normalizePath(window.location.pathname) && target.search === window.location.search) return;

      event.preventDefault();
      window.history.pushState({}, "", `${target.pathname}${target.search}${target.hash}`);
      setPath(nextPath);
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (path === "/simulasi") {
    return <CatalogPage />;
  }

  if (path.startsWith("/simulasi/")) {
    const slug = path.replace(/^\/simulasi\/?/, "");
    return <SimulationPage slug={slug || undefined} />;
  }

  if (path === "/") {
    return <LandingPage />;
  }

  return <NotFoundPage />;
}

export default App;

