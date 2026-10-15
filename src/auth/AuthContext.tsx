import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Account = {
  id: string;
  email: string;
  name: string | null;
  role: "GURU" | "SISWA" | null;
  classLevel: number | null;
};

type AuthContextValue = {
  user: Account | null;
  loading: boolean;
  refresh: () => Promise<Account | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
// Production routes API calls through the frontend origin (Vercel rewrite) so
// the session cookie remains first-party in the browser. Vite proxies /api in dev.
const API_URL = "";

export async function authRequest<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}/api/auth${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Permintaan belum dapat diproses.");
  return data as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await authRequest<{ user: Account }>("/me");
      setUser(result.user);
      return result.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const logout = useCallback(async () => {
    try { await authRequest("/logout", {}); } finally { setUser(null); }
  }, []);

  const value = useMemo(() => ({ user, loading, refresh, logout }), [user, loading, refresh, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  return value;
}
