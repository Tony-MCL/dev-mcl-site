import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

const HomePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page home-page">
      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">{t("home.hero.title")}</h1>

        <p className="hero-tagline">{t("home.hero.tagline")}</p>

        <p className="hero-sub" style={{ maxWidth: 820 }}>
          {t("home.hero.sub")}
        </p>
      </section>

      {/* HVA SOM BYGGES */}
      <section>
        <h2 style={{ marginBottom: "0.6rem" }}>{t("home.sections.building")}</h2>

        <section className="intro-grid">
          {/* MANAGE PROGRESS – FULL BREDD */}
          <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
            <h3>{t("home.cards.progress.title")}</h3>
            <p>{t("home.cards.progress.body")}</p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.8rem",
                marginTop: "1rem",
              }}
            >
              {/* Ekstern lenke til ManageSystem */}
              <a
                href={LINKS.ms}
                className="hero-cta"
                rel="noopener noreferrer"
              >
                {t("home.cards.progress.cta")}
              </a>

              <Link
                to="/kontakt"
                style={{
                  alignSelf: "center",
                  fontSize: "0.95rem",
                  textDecoration: "underline",
                }}
              >
                {t("home.cards.progress.contactCta")}
              </Link>
            </div>
          </div>

          {/* TJENESTER */}
          <div className="intro-card">
            <h3>{t("home.cards.services.title")}</h3>
            <p>{t("home.cards.services.body")}</p>

            <p style={{ marginTop: "0.7rem" }}>
              <Link to="/idebank">{t("home.cards.services.cta")}</Link>
            </p>
          </div>

          <div className="intro-card">
            <h3>{t("home.cards.documentation.title")}</h3>
            <p>{t("home.cards.documentation.body")}</p>
          </div>

          <div className="intro-card">
            <h3>{t("home.cards.realWorld.title")}</h3>
            <p>{t("home.cards.realWorld.body")}</p>
          </div>
        </section>
      </section>

      {/* PRINSIPPER */}
      <section>
        <h2 style={{ marginBottom: "0.6rem" }}>{t("home.sections.principles")}</h2>

        <section className="intro-grid">
          <div className="intro-card">
            <h3>{t("home.principles.singleSource.title")}</h3>
            <p>{t("home.principles.singleSource.body")}</p>
          </div>

          <div className="intro-card">
            <h3>{t("home.principles.predictability.title")}</h3>
            <p>{t("home.principles.predictability.body")}</p>
          </div>

          <div className="intro-card">
            <h3>{t("home.principles.respect.title")}</h3>
            <p>{t("home.principles.respect.body")}</p>
          </div>
        </section>
      </section>

      {/* HVEM DETTE PASSER FOR */}
      <section>
        <h2 style={{ marginBottom: "0.6rem" }}>{t("home.sections.audience")}</h2>
        <p style={{ maxWidth: 820 }}>{t("home.audience")}</p>
      </section>
    </main>
  );
};

export default HomePage;
