import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { getPageTextValue } from "../config/pageOverrides";

const PAGE_SLUG = "services" as const;

const IdeaBankPage: React.FC = () => {
  const { t, lang } = useI18n();
  const tr = (key: string) => getPageTextValue(PAGE_SLUG, key, lang, t(key));

  return (
    <main className="page services-page">
      <section className="fs-hero">
        <h1>{tr("services.hero.title")}</h1>

        <p className="fs-tagline" style={{ maxWidth: 900 }}>
          {tr("services.hero.tagline")}
        </p>

        <p style={{ maxWidth: 980, marginTop: "0.9rem" }}>
          {tr("services.hero.p1")}
        </p>

        <p style={{ maxWidth: 980 }}>{tr("services.hero.p2")}</p>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.8rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" className="status-button" style={{ textDecoration: "none" }}>
            {tr("services.hero.back")}
          </Link>
          <Link
            to="/kontakt"
            className="status-button"
            style={{ textDecoration: "none" }}
          >
            {tr("services.hero.contact")}
          </Link>
        </div>
      </section>

      <section className="intro-grid two-columns">
        <div className="intro-card">
          <p className="model-label">{tr("services.model1.label")}</p>
          <h3 style={{ marginTop: "0.35rem" }}>{tr("services.model1.title")}</h3>
          <p>{tr("services.model1.lead")}</p>

          <ul style={{ marginTop: "0.9rem" }}>
            <li>
              <strong>{tr("services.model1.bullets.b1Strong")}</strong>{" "}
              {tr("services.model1.bullets.b1")}
            </li>
            <li>
              <strong>{tr("services.model1.bullets.b2Strong")}</strong>{" "}
              {tr("services.model1.bullets.b2")}
            </li>
            <li>
              <strong>{tr("services.model1.bullets.b3Strong")}</strong>{" "}
              {tr("services.model1.bullets.b3")}
            </li>
          </ul>

          <p style={{ marginTop: "0.9rem" }}>{tr("services.model1.p1")}</p>

          <p style={{ marginTop: "0.7rem" }}>
            <Link to="/kontakt">{tr("services.model1.cta")}</Link>
          </p>
        </div>

        <div className="intro-card">
          <p className="model-label">{tr("services.model2.label")}</p>
          <h3 style={{ marginTop: "0.35rem" }}>{tr("services.model2.title")}</h3>
          <p>{tr("services.model2.lead")}</p>

          <ul style={{ marginTop: "0.9rem" }}>
            <li>
              <strong>{tr("services.model2.bullets.b1Strong")}</strong>{" "}
              {tr("services.model2.bullets.b1")}
            </li>
            <li>
              <strong>{tr("services.model2.bullets.b2Strong")}</strong>{" "}
              {tr("services.model2.bullets.b2")}
            </li>
            <li>
              <strong>{tr("services.model2.bullets.b3Strong")}</strong>{" "}
              {tr("services.model2.bullets.b3")}
            </li>
          </ul>

          <p style={{ marginTop: "0.9rem" }}>
            {tr("services.model2.p1a")} <strong>{tr("services.model2.p1bStrong")}</strong>{" "}
            {tr("services.model2.p1c")}
          </p>

          <p style={{ marginTop: "0.7rem" }}>
            <a href="mailto:idebank@morningcoffeelabs.no">
              {tr("services.model2.submitEmailCta")} idebank@morningcoffeelabs.no
            </a>
          </p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{tr("services.interesting.title")}</h3>
          <p>{tr("services.interesting.lead")}</p>

          <ul style={{ marginTop: "0.9rem" }}>
            <li>{tr("services.interesting.bullets.b1")}</li>
            <li>{tr("services.interesting.bullets.b2")}</li>
            <li>{tr("services.interesting.bullets.b3")}</li>
            <li>{tr("services.interesting.bullets.b4")}</li>
          </ul>

          <p style={{ marginTop: "0.9rem", marginBottom: 0 }}>
            {tr("services.interesting.exampleLead")}{" "}
            <Link to="/progress">{tr("services.interesting.exampleCta")}</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default IdeaBankPage;
