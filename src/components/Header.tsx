import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import type { Lang } from "../i18n";

const assetBase = import.meta.env.BASE_URL || "/";
const logoUrl = `${assetBase}mcl-logo.png`;

type ThemeMode = "light" | "dark";

function applyTheme(mode: ThemeMode) {
  const html = document.documentElement;
  if (mode === "dark") html.setAttribute("data-theme", "dark");
  else html.removeAttribute("data-theme");
}

function readPrefsFromUrl(): { theme?: ThemeMode; lang?: Lang } {
  // Leser både vanlig query (?a=b) og hash-query (#/path?a=b)
  const href = window.location.href;
  const url = new URL(href);

  const out: { theme?: ThemeMode; lang?: Lang } = {};

  const lang = url.searchParams.get("lang");
  const theme = url.searchParams.get("theme");

  if (lang === "no" || lang === "en") out.lang = lang;
  if (theme === "dark" || theme === "light") out.theme = theme;

  // HashRouter kan legge parametre etter ? i hash
  if (url.hash && url.hash.includes("?")) {
    const idx = url.hash.indexOf("?");
    const qs = url.hash.slice(idx + 1);
    const sp = new URLSearchParams(qs);

    const hLang = sp.get("lang");
    const hTheme = sp.get("theme");

    if (!out.lang && (hLang === "no" || hLang === "en")) out.lang = hLang;
    if (!out.theme && (hTheme === "dark" || hTheme === "light")) out.theme = hTheme as ThemeMode;
  }

  return out;
}

function getInitialTheme(): ThemeMode {
  const fromUrl = readPrefsFromUrl().theme;
  if (fromUrl === "dark" || fromUrl === "light") return fromUrl;

  const saved = localStorage.getItem("mcl_theme");
  if (saved === "dark" || saved === "light") return saved;

  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const location = useLocation();

  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    localStorage.setItem("mcl_theme", initial);
    applyTheme(initial);
  }, []);

  const closeMenu = () => setOpen(false);
  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("mcl_theme", next);
    applyTheme(next);
  };

  const toggleLang = () => {
    const next: Lang = lang === "no" ? "en" : "no";
    setLang(next);
    closeMenu();
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Link to="/" onClick={closeMenu}>
            <img src={logoUrl} alt="Morning Coffee Labs" />
          </Link>
        </div>

        <nav className="header-nav">
          <Link className={isActive("/") ? "active" : ""} to="/">
            {t("header.nav.home")}
          </Link>

          <a href="/#apps">{t("header.nav.apps")}</a>
          <a href="/#lab">{t("header.nav.inLab")}</a>
          <a href="/#workshop">{t("header.nav.workshop")}</a>

          <Link className={isActive("/om") ? "active" : ""} to="/om">
            {t("header.nav.about")}
          </Link>

          <Link className={isActive("/kontakt") ? "active" : ""} to="/kontakt">
            {t("header.nav.contact")}
          </Link>

        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleLang}
            aria-label={t("header.lang.aria")}
            title={t("header.lang.label")}
          >
            <span className="theme-icon" aria-hidden="true">
              🌐
            </span>
            <span className="theme-label">
              {lang === "no" ? t("header.lang.nb") : t("header.lang.en")}
            </span>
          </button>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("header.theme.ariaToLight") : t("header.theme.ariaToDark")}
            title={theme === "dark" ? t("header.theme.titleLight") : t("header.theme.titleDark")}
          >
            <span className="theme-icon" aria-hidden="true">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span className="theme-label">
              {theme === "dark" ? t("header.theme.labelDark") : t("header.theme.labelLight")}
            </span>
          </button>

          <div className="hamburger" onClick={() => setOpen((prev) => !prev)}>
            ☰
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          {t("header.nav.home")}
        </Link>

        <a href="/#apps" onClick={closeMenu}>{t("header.nav.apps")}</a>
        <a href="/#lab" onClick={closeMenu}>{t("header.nav.inLab")}</a>
        <a href="/#workshop" onClick={closeMenu}>{t("header.nav.workshop")}</a>

        <Link to="/om" onClick={closeMenu}>
          {t("header.nav.about")}
        </Link>

        <Link to="/kontakt" onClick={closeMenu}>
          {t("header.nav.contact")}
        </Link>

        <button type="button" className="theme-toggle mobile" onClick={toggleLang}>
          <span className="theme-icon" aria-hidden="true">
            🌐
          </span>
          <span className="theme-label">
            {t("header.lang.label")}: {lang === "no" ? t("header.lang.nb") : t("header.lang.en")}
          </span>
        </button>

        <button type="button" className="theme-toggle mobile" onClick={toggleTheme}>
          <span className="theme-icon" aria-hidden="true">
            {theme === "dark" ? "🌙" : "☀️"}
          </span>
          <span className="theme-label">
            {theme === "dark" ? t("header.theme.mobileDark") : t("header.theme.mobileLight")}
          </span>
        </button>
      </div>
    </>
  );
};

export default Header;
