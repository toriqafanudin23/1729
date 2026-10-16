import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireLogin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <main className="app-loading" role="status">Memeriksa sesi login…</main>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          loginRequired: true,
          from: location.pathname + location.search + location.hash,
        }}
      />
    );
  }

  return children;
}
