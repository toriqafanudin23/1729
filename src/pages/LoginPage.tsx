import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { authRequest, useAuth } from "../auth/AuthContext";
import { ArrowRight, Check, GraduationCap, Mail, MailWarning, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useSeo } from "../useSeo";
import "./LoginPage.css";

type Stage = "email" | "sent" | "profile";
type EmailFlow = "login" | "register";
type Role = "GURU" | "SISWA";

const STEPS: { stage: Stage; label: string }[] = [
  { stage: "email", label: "Email" },
  { stage: "sent", label: "Verifikasi" },
  { stage: "profile", label: "Profil" },
];

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

  const stepIndex = STEPS.findIndex((step) => step.stage === stage);
  const showSteps = !loginToken && emailFlow !== "login";
  const title = stage === "profile"
    ? "Lengkapi akun"
    : loginToken
      ? "Memeriksa tautan…"
      : stage === "sent"
        ? "Periksa email Anda"
        : "Masuk ke 1729";
  const intro = stage === "profile"
    ? "Satu langkah lagi sebelum mulai belajar."
    : stage === "sent"
      ? "Kami baru saja mengirim pesan verifikasi."
      : "Masuk atau daftar cukup dengan email. Tanpa kata sandi.";

  return (
    <div className="lp login-page">
      <SiteHeader />
      <main className="login-main">
        <div className="login-shell">
          {/* Panel kiri: identitas */}
          <aside className="login-aside" aria-hidden="true">
            <div className="login-aside-grid" />
            <span className="login-aside-brand">1729<i /></span>

            <svg className="login-plot" viewBox="0 0 360 220" fill="none">
              <g stroke="rgba(148,163,184,.18)" strokeWidth="1">
                {[40, 80, 120, 160, 200].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="360" y2={y} />)}
                {[60, 120, 180, 240, 300].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="220" />)}
              </g>
              <g stroke="rgba(226,232,240,.5)" strokeWidth="1.4">
                <line x1="0" y1="150" x2="360" y2="150" />
                <line x1="180" y1="0" x2="180" y2="220" />
              </g>
              <path d="M40 -10 Q180 330 320 -10" stroke="#e2e8f0" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="180" cy="150" r="5" fill="#c96442" />
              <circle cx="180" cy="150" r="11" stroke="#c96442" strokeOpacity=".35" />
            </svg>

            <div className="login-aside-copy">
              <p className="login-aside-kicker">Ruang belajar matematika</p>
              <h2>Lihat matematika bergerak.</h2>
              <p>Simulasi interaktif, presentasi, dan latihan yang membuat konsep terasa nyata.</p>
              <ul>
                <li><Sparkles size={16} strokeWidth={1.8} />Simulasi interaktif</li>
                <li><GraduationCap size={16} strokeWidth={1.8} />Materi per jenjang kelas</li>
                <li><ShieldCheck size={16} strokeWidth={1.8} />Tanpa kata sandi</li>
              </ul>
            </div>
          </aside>

          {/* Panel kanan: formulir */}
          <section className="login-card" aria-labelledby="login-title">
            <Link to="/" className="login-brand" aria-label="1729 beranda">1729</Link>

            {showSteps && (
              <ol className="login-steps" aria-label="Langkah pendaftaran">
                {STEPS.map((step, index) => (
                  <li key={step.stage} className={index === stepIndex ? "is-current" : index < stepIndex ? "is-done" : ""} aria-current={index === stepIndex ? "step" : undefined}>
                    <span className="login-step-dot">{index < stepIndex ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : index + 1}</span>
                    <span className="login-step-label">{step.label}</span>
                  </li>
                ))}
              </ol>
            )}

            <h1 id="login-title">{title}</h1>
            <p className="login-intro">{intro}</p>

            {notice && <p className="login-message" role="status">{notice}</p>}
            {error && <p className="login-error" role="alert">{error}</p>}

            {stage === "email" && !loginToken && (
              <form onSubmit={submitEmail} className="login-form">
                <label htmlFor="login-email">Alamat email</label>
                <div className="login-field">
                  <Mail size={18} strokeWidth={1.8} aria-hidden="true" />
                  <input id="login-email" type="email" autoComplete="email" required maxLength={254} placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <button className="login-submit" type="submit" disabled={busy}>
                  <span>{busy ? "Mengirim…" : "Lanjutkan dengan email"}</span>
                  {!busy && <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />}
                </button>
              </form>
            )}

            {stage === "sent" && (
              <>
                <div className="login-sent-box">
                  <span className="login-sent-icon"><Mail size={20} strokeWidth={1.8} aria-hidden="true" /></span>
                  {emailFlow === "login" ? (
                    <p className="login-sent">Tautan login telah dikirim ke <strong>{email}</strong>. Buka email tersebut, lalu tekan tombol login untuk masuk.</p>
                  ) : (
                    <p className="login-sent">Kode verifikasi telah dikirim ke <strong>{email}</strong>. Masukkan kode OTP untuk melanjutkan pendaftaran.</p>
                  )}
                </div>

                {emailFlow === "login" ? (
                  <button className="login-submit" type="button" onClick={confirmMagicLink} disabled={busy}>
                    <span>{busy ? "Memeriksa…" : "Saya sudah menekan tombol login"}</span>
                  </button>
                ) : (
                  <form onSubmit={submitCode} className="login-form">
                    <label htmlFor="login-code">Kode OTP 6 digit</label>
                    <input id="login-code" className="login-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="······" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} />
                    <button className="login-submit" type="submit" disabled={busy || code.length !== 6}>
                      <span>{busy ? "Memeriksa…" : "Verifikasi email"}</span>
                    </button>
                  </form>
                )}

                <p className="login-spam-note">
                  <MailWarning size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>Belum menerima email? Periksa folder Spam atau Junk.</span>
                </p>
                <button className="login-back" type="button" onClick={() => { setStage("email"); setEmailFlow(null); setCode(""); setError(""); }}>Gunakan email lain</button>
              </>
            )}

            {stage === "profile" && (
              <form onSubmit={submitProfile} className="login-form">
                <label htmlFor="profile-name">Nama lengkap</label>
                <div className="login-field">
                  <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />
                  <input id="profile-name" autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
                </div>
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
                <button className="login-submit" type="submit" disabled={busy}><span>{busy ? "Membuat akun…" : "Buat akun"}</span></button>
              </form>
            )}

            <p className="login-footnote">Simulasi, presentasi, dan latihan tetap dapat digunakan tanpa login.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
