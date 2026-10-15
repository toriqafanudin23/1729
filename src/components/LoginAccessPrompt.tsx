import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./LoginAccessPrompt.css";

interface LoginAccessPromptProps {
  title: string;
  description: string;
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="10.5" width="16" height="10" rx="3" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function LoginAccessPrompt({ title, description }: LoginAccessPromptProps) {
  const { user } = useAuth();
  if (user) return null;

  return (
    <aside className="login-access-prompt" aria-labelledby="login-access-title">
      <span className="login-access-prompt__icon"><LockIcon /></span>
      <div className="login-access-prompt__text">
        <h2 id="login-access-title" className="login-access-prompt__title">{title}</h2>
        <p className="login-access-prompt__desc">{description}</p>
      </div>
      <div className="login-access-prompt__action">
        <Link to="/login" className="login-access-prompt__btn">
          Masuk atau daftar <span aria-hidden="true">→</span>
        </Link>
        <span className="login-access-prompt__note">Gratis. Cukup dengan email, tanpa kata sandi.</span>
      </div>
    </aside>
  );
}
