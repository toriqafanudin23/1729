import { Link } from "react-router-dom";
import "./SiteHeader.css";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" to="/" aria-label="1729 beranda">
          1729
        </Link>
      </div>
    </header>
  );
}