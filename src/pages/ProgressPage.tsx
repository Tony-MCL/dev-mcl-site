import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const ProgressPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page">
      {/* HERO */}
      <section className="fs-hero">
        <h1>Manage Progress</h1>

        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {t("progressPage.hero.tagline")}
        </p>

        <p style={{ maxWidth: 980, marginTop: "1rem" }}>
          {t("progressPage.hero.intro")}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginTop: "1rem" }}>
          <span className="badge">{t("progressPage.hero.badge")}</span>

          <Link
            to="/kontakt"
            style={{
              alignSelf: "center",
              fontSize: "0.95rem",
              textDecoration: "underline",
            }}
          >
            {t("progressPage.hero.notifyCta")}
          </Link>
        </div>
      </section>

      {/* INNHOLD */}
      <section className="intro-grid two-columns">
        <div className="intro-card">
          <h3>{t("progressPage.cards.oneTruth.title")}</h3>
          <p>{t("progressPage.cards.oneTruth.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("progressPage.cards.realProjects.title")}</h3>
          <p>{t("progressPage.cards.realProjects.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("progressPage.cards.print.title")}</h3>
          <p>{t("progressPage.cards.print.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("progressPage.cards.lowFriction.title")}</h3>
          <p>{t("progressPage.cards.lowFriction.body")}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{t("progressPage.audience.title")}</h3>
          <p style={{ maxWidth: 980 }}>{t("progressPage.audience.body")}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{t("progressPage.next.title")}</h3>
          <p style={{ maxWidth: 980, marginBottom: 0 }}>
            {t("progressPage.next.body")}
          </p>

          <p style={{ marginTop: "1rem", marginBottom: 0 }}>
            <Link to="/">{t("progressPage.next.back")}</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default ProgressPage;
