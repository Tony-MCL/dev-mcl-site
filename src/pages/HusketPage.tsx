import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const HusketPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page husket-page">
      {/* =============================== */}
      {/* HERO */}
      {/* =============================== */}
      <section className="husket-hero-layout">
        <div className="husket-logo-wrap" aria-hidden="true">
          <img
            src={`${import.meta.env.BASE_URL}husketlogo.svg`}
            alt="Husk'et"
            className="husket-logo-image"
          />
        </div>

        <div className="husket-hero-copy">
          <p className="husket-hero-tagline">{t("husket.hero.tagline")}</p>
          <p className="husket-hero-intro">{t("husket.hero.intro")}</p>
        </div>
      </section>

      {/* =============================== */}
      {/* BADGES */}
      {/* =============================== */}
      <section className="husket-meta-row">
        <span className="badge">{t("husket.hero.badgeOne")}</span>
        <span className="badge">{t("husket.hero.badgeTwo")}</span>
      </section>

      {/* =============================== */}
      {/* CONTENT */}
      {/* =============================== */}
      <section className="intro-grid two-columns">
        <div className="intro-card">
          <h3>{t("husket.cards.capture.title")}</h3>
          <p>{t("husket.cards.capture.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("husket.cards.structure.title")}</h3>
          <p>{t("husket.cards.structure.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("husket.cards.offline.title")}</h3>
          <p>{t("husket.cards.offline.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("husket.cards.privacy.title")}</h3>
          <p>{t("husket.cards.privacy.body")}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{t("husket.legal.title")}</h3>
          <p>{t("husket.legal.body")}</p>

          <div className="husket-legal-links">
            <Link to="/husket/personvern">
              {t("husket.legal.links.privacy")}
            </Link>
            <Link to="/husket/brukervilkar">
              {t("husket.legal.links.termsUse")}
            </Link>
            <Link to="/husket/kjopsvilkar">
              {t("husket.legal.links.termsPurchase")}
            </Link>
            <Link to="/husket/refusjon">
              {t("husket.legal.links.refund")}
            </Link>
          </div>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{t("husket.next.title")}</h3>
          <p style={{ marginBottom: 0 }}>{t("husket.next.body")}</p>
        </div>
      </section>
    </main>
  );
};

export default HusketPage;
