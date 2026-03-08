import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const AboutPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page about-page">
      {/* HERO */}
      <section className="fs-hero">
        <h1>{t("about.hero.title")}</h1>

        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {t("about.hero.tagline")}
        </p>
      </section>

      {/* CONTENT (fliser) */}
      <section className="intro-grid two-columns">
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{t("about.started.title")}</h2>
          <p>{t("about.started.p1")}</p>
          <p style={{ marginBottom: 0 }}>{t("about.started.p2")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("about.workshop.title")}</h3>
          <p>{t("about.workshop.p1")}</p>
          <p style={{ marginBottom: 0 }}>{t("about.workshop.p2")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("about.quality.title")}</h3>
          <p>{t("about.quality.p1")}</p>
          <p style={{ marginBottom: 0 }}>{t("about.quality.p2")}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{t("about.principles.title")}</h2>
          <p>{t("about.principles.lead")}</p>

          <ul style={{ marginTop: "0.8rem" }}>
            <li>
              <strong>{t("about.principles.bullets.singleSource")}:</strong>{" "}
              {t("about.principles.bullets.singleSourceBody")}
            </li>
            <li>
              <strong>{t("about.principles.bullets.predictability")}:</strong>{" "}
              {t("about.principles.bullets.predictabilityBody")}
            </li>
            <li>
              <strong>{t("about.principles.bullets.respect")}:</strong>{" "}
              {t("about.principles.bullets.respectBody")}
            </li>
            <li>
              <strong>{t("about.principles.bullets.realWork")}:</strong>{" "}
              {t("about.principles.bullets.realWorkBody")}
            </li>
          </ul>

          <p style={{ marginBottom: 0 }}>
            {t("about.principles.outro")} <em>{t("about.principles.outroEm")}</em>
          </p>
        </div>

        <div className="intro-card">
          <h3>{t("about.deliver.title")}</h3>
          <p>{t("about.deliver.p1")}</p>
          <p style={{ marginBottom: 0 }}>
            {t("about.deliver.linkLead")}{" "}
            <Link to="/idebank">{t("about.deliver.linkCta")}</Link>
          </p>
        </div>

        <div className="intro-card">
          <h3>{t("about.direction.title")}</h3>
          <p>{t("about.direction.p1")}</p>
          <p style={{ marginBottom: 0 }}>
            {t("about.direction.linkLead")}{" "}
            <Link to="/progress">{t("about.direction.linkCta")}</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
