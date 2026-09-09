import { NavLink } from "react-router-dom";
import { siteName, navLinks } from "../data/config";

export default function Nav() {
  return (
    <header className="border-b border-border px-4 py-6">
      <NavLink to="/" className="text-sm font-bold tracking-wide">
        {siteName}
        <span className="cursor-blink">_</span>
      </NavLink>

      <nav className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
        {navLinks.map((link, i) => (
          <span key={link.to} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted">//</span>}
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => (isActive ? "nav-link-active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          </span>
        ))}
      </nav>
    </header>
  );
}
