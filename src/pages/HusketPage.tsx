import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const HusketPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page husket-page">
      <section className="fs-hero husket-hero">
        <div className="husket-hero-badges">
          <span className="badge">{t("husket.hero.badgeOne")}</span>
          <span className="badge">{t("husket.hero.badgeTwo")}</span>
        </div>

        <h1>{t("husket.hero.title")}</h1>

        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {t("husket.hero.tagline")}
        </p>

        <p style={{ maxWidth: 980, marginTop: "1rem" }}>
          {t("husket.hero.intro")}
        </p>
      </section>

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
            <Link to="/husket/personvern">{t("husket.legal.links.privacy")}</Link>
            <Link to="/husket/brukervilkar">{t("husket.legal.links.termsUse")}</Link>
            <Link to="/husket/kjopsvilkar">{t("husket.legal.links.termsPurchase")}</Link>
            <Link to="/husket/refusjon">{t("husket.legal.links.refund")}</Link>
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
