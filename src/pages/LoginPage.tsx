import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { authRequest, useAuth } from "../auth/AuthContext";
import { useSeo } from "../useSeo";
import "./LoginPage.css";

type Stage = "email" | "sent" | "profile";
type EmailFlow = "login" | "register";
type Role = "GURU" | "SISWA";

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export default function LoginPage() {
  useSeo({ title: "Login — 1729", description: "Masuk atau buat akun 1729 dengan email.", path: "/login" });
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [stage, setStage] = useState<Stage>("email");
  const [emailFlow, setEmailFlow] = useState<EmailFlow | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("SISWA");
  const [classLevel, setClassLevel] = useState("10");
  const [notice, setNotice] = useState(() => (
    (location.state as { loginRequired?: boolean } | null)?.loginRequired
      ? "Materi ini memerlukan login. Masuk atau daftar untuk melanjutkan."
      : ""
  ));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const loginToken = searchParams.get("token");

  useEffect(() => {
    if (!loginToken) return;
    let active = true;
    setBusy(true);
    authRequest("/verify-link", { token: loginToken })
      .then(async () => {
        await refresh();
        if (active) navigate("/", { replace: true });
      })
      .catch((reason: Error) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [loginToken, navigate, refresh]);

  useEffect(() => { if (user && !loginToken) navigate("/", { replace: true }); }, [user, loginToken, navigate]);

  async function submitEmail(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const result = await authRequest<{ flow: EmailFlow }>("/start", { email });
      setEmail(email.trim().toLowerCase());
      setEmailFlow(result.flow);
      setStage("sent");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Email belum dapat dikirim."); }
    finally { setBusy(false); }
  }

  async function submitCode(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await authRequest("/verify-otp", { email, code });
      setStage("profile");
      setNotice("Email terverifikasi. Lengkapi data akun untuk melanjutkan.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Kode belum dapat diverifikasi."); }
    finally { setBusy(false); }
  }

  async function submitProfile(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await authRequest("/complete-profile", { name, role, classLevel: role === "SISWA" ? Number(classLevel) : null });
      await refresh();
      navigate("/", { replace: true });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Akun belum dapat dibuat."); }
    finally { setBusy(false); }
  }

  async function confirmMagicLink() {
    setBusy(true); setError("");
    const signedIn = await refresh();
    if (signedIn) navigate("/", { replace: true });
    else setError("Sesi login belum ditemukan. Buka tombol login dari email pada perangkat ini.");
    setBusy(false);
  }

  return (
    <div className="lp login-page">
      <SiteHeader />
      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          <Link to="/" className="login-brand" aria-label="1729 beranda">1729</Link>
          <p className="login-eyebrow">Ruang belajar matematika</p>
          <h1 id="login-title">{stage === "profile" ? "Lengkapi akun" : loginToken ? "Memeriksa tautan…" : "Masuk ke 1729"}</h1>
          <p className="login-intro">
            {stage === "profile" ? "Satu langkah lagi sebelum mulai belajar." : "Masuk atau daftar cukup dengan email. Tanpa kata sandi."}
          </p>

          {notice && <p className="login-message" role="status">{notice}</p>}
          {error && <p className="login-error" role="alert">{error}</p>}

          {stage === "email" && !loginToken && (
            <form onSubmit={submitEmail} className="login-form">
              <label htmlFor="login-email">Alamat email</label>
              <input id="login-email" type="email" autoComplete="email" required maxLength={254} placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              <button className="login-submit" type="submit" disabled={busy}>{busy ? "Mengirim…" : "Lanjutkan dengan email"}</button>
            </form>
          )}

          {stage === "sent" && (
            <>
              <div className="login-sent-icon"><MailIcon /></div>
              {emailFlow === "login" ? (
                <>
                  <p className="login-sent">Tautan login telah dikirim ke <strong>{email}</strong>. Buka email tersebut, lalu tekan tombol login untuk masuk.</p>
                  <button className="login-secondary" type="button" onClick={confirmMagicLink} disabled={busy}>Saya sudah menekan tombol login</button>
                </>
              ) : (
                <>
                  <p className="login-sent">Kode verifikasi telah dikirim ke <strong>{email}</strong>. Masukkan kode OTP untuk melanjutkan pendaftaran.</p>
                  <form onSubmit={submitCode} className="login-form" style={{ marginTop: 0 }}>
                    <label htmlFor="login-code">Kode OTP 6 digit</label>
                    <input id="login-code" className="login-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="······" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} />
                    <button className="login-submit" type="submit" disabled={busy || code.length !== 6}>{busy ? "Memeriksa…" : "Verifikasi email"}</button>
                  </form>
                </>
              )}
              <button className="login-back" type="button" onClick={() => { setStage("email"); setCode(""); setError(""); }}>Gunakan email lain</button>
            </>
          )}

          {stage === "profile" && (
            <form onSubmit={submitProfile} className="login-form">
              <label htmlFor="profile-name">Nama lengkap</label>
              <input id="profile-name" autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
              <span className="login-label" id="profile-role-label">Saya adalah</span>
              <div className="login-segment" role="group" aria-labelledby="profile-role-label">
                {([["SISWA", "Siswa"], ["GURU", "Guru"]] as const).map(([value, label]) => (
                  <button key={value} type="button" className={role === value ? "is-active" : ""} aria-pressed={role === value} onClick={() => setRole(value)}>{label}</button>
                ))}
              </div>
              {role === "SISWA" && (
                <>
                  <label htmlFor="profile-class">Kelas</label>
                  <select id="profile-class" value={classLevel} onChange={(event) => setClassLevel(event.target.value)}>
                    {[7, 8, 9, 10, 11, 12].map((grade) => <option value={grade} key={grade}>Kelas {grade}</option>)}
                  </select>
                </>
              )}
              <button className="login-submit" type="submit" disabled={busy}>{busy ? "Membuat akun…" : "Buat akun"}</button>
            </form>
          )}
          <p className="login-footnote">Simulasi, presentasi, dan latihan tetap dapat digunakan tanpa login.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
