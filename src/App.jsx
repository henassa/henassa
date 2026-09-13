import { NavLink } from "react-router-dom";
import { siteName, navLinks } from "../data/config";

export default function Nav() {
  return (
    <header
      className="px-4 py-3"
      style={{
        background: "linear-gradient(to bottom, #3a3a3a, #0a0a0a)",
        borderBottom: "1px solid #000",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      <NavLink
        to="/"
        className="text-lg font-bold"
        style={{ color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.4)", textDecoration: "none" }}
      >
        {siteName}
      </NavLink>

      <nav className="mt-2.5 flex flex-wrap items-center gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => (isActive ? "nav-link-active" : "nav-link")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}