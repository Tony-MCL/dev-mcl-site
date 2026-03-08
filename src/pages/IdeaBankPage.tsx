import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const IdeaBankPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page services-page">
      {/* HERO / INTRO (uten flis) */}
      <section className="fs-hero">
        <h1>{t("services.hero.title")}</h1>

        <p className="fs-tagline" style={{ maxWidth: 900 }}>
          {t("services.hero.tagline")}
        </p>

        <p style={{ maxWidth: 980, marginTop: "0.9rem" }}>
          {t("services.hero.p1")}
        </p>

        <p style={{ maxWidth: 980 }}>{t("services.hero.p2")}</p>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.8rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" className="status-button" style={{ textDecoration: "none" }}>
            {t("services.hero.back")}
          </Link>
          <Link
            to="/kontakt"
            className="status-button"
            style={{ textDecoration: "none" }}
          >
            {t("services.hero.contact")}
          </Link>
        </div>
      </section>

      {/* MODELLER + VIDERE INNHOLD (i fliser) */}
      <section className="intro-grid two-columns">
        {/* Modell 1 */}
        <div className="intro-card">
          <p className="model-label">{t("services.model1.label")}</p>
          <h3 style={{ marginTop: "0.35rem" }}>{t("services.model1.title")}</h3>
          <p>{t("services.model1.lead")}</p>

          <ul style={{ marginTop: "0.9rem" }}>
            <li>
              <strong>{t("services.model1.bullets.b1Strong")}</strong>{" "}
              {t("services.model1.bullets.b1")}
            </li>
            <li>
              <strong>{t("services.model1.bullets.b2Strong")}</strong>{" "}
              {t("services.model1.bullets.b2")}
            </li>
            <li>
              <strong>{t("services.model1.bullets.b3Strong")}</strong>{" "}
              {t("services.model1.bullets.b3")}
            </li>
          </ul>

          <p style={{ marginTop: "0.9rem" }}>{t("services.model1.p1")}</p>

          <p style={{ marginTop: "0.7rem" }}>
            <Link to="/kontakt">{t("services.model1.cta")}</Link>
          </p>
        </div>

        {/* Modell 2 */}
        <div className="intro-card">
          <p className="model-label">{t("services.model2.label")}</p>
          <h3 style={{ marginTop: "0.35rem" }}>{t("services.model2.title")}</h3>
          <p>{t("services.model2.lead")}</p>

          <ul style={{ marginTop: "0.9rem" }}>
            <li>
              <strong>{t("services.model2.bullets.b1Strong")}</strong>{" "}
              {t("services.model2.bullets.b1")}
            </li>
            <li>
              <strong>{t("services.model2.bullets.b2Strong")}</strong>{" "}
              {t("services.model2.bullets.b2")}
            </li>
            <li>
              <strong>{t("services.model2.bullets.b3Strong")}</strong>{" "}
              {t("services.model2.bullets.b3")}
            </li>
          </ul>

          <p style={{ marginTop: "0.9rem" }}>
            {t("services.model2.p1a")} <strong>{t("services.model2.p1bStrong")}</strong>{" "}
            {t("services.model2.p1c")}
          </p>

          <p style={{ marginTop: "0.7rem" }}>
            <a href="mailto:idebank@morningcoffeelabs.no">
              {t("services.model2.submitEmailCta")} idebank@morningcoffeelabs.no
            </a>
          </p>
        </div>

        {/* Hva som gjør en idé interessant (full bredde flis) */}
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{t("services.interesting.title")}</h3>
          <p>{t("services.interesting.lead")}</p>

          <ul style={{ marginTop: "0.9rem" }}>
            <li>{t("services.interesting.bullets.b1")}</li>
            <li>{t("services.interesting.bullets.b2")}</li>
            <li>{t("services.interesting.bullets.b3")}</li>
            <li>{t("services.interesting.bullets.b4")}</li>
          </ul>

          <p style={{ marginTop: "0.9rem", marginBottom: 0 }}>
            {t("services.interesting.exampleLead")}{" "}
            <Link to="/progress">{t("services.interesting.exampleCta")}</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default IdeaBankPage;
