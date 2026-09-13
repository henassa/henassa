import { NavLink } from "react-router-dom";
import { siteName, navLinks } from "../data/config";

export default function Nav() {
  return (
    <header
      className="px-4 py-3"
      style={{
        background: "linear-gradient(to bottom, #d8d8d8 0%, #888 45%, #bbb 55%, #444 100%)",
        borderBottom: "1px solid #000",
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      <NavLink
        to="/"
        className="text-lg font-bold"
        style={{
          textDecoration: "none",
          background: "linear-gradient(to bottom, #fff 0%, #999 45%, #fff 55%, #666 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 0 6px rgba(0,229,255,0.9)) drop-shadow(-1px 0 rgba(255,0,60,0.6)) drop-shadow(1px 0 rgba(0,200,255,0.6))",
        }}
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