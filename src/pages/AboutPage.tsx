import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { getPageTextValue } from "../config/pageOverrides";

const PAGE_SLUG = "about" as const;

const AboutPage: React.FC = () => {
  const { t, lang } = useI18n();
  const tr = (key: string) => getPageTextValue(PAGE_SLUG, key, lang, t(key));

  return (
    <main className="page about-page">
      <section className="fs-hero">
        <h1>{tr("about.hero.title")}</h1>

        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {tr("about.hero.tagline")}
        </p>
      </section>

      <section className="intro-grid two-columns">
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{tr("about.started.title")}</h2>
          <p>{tr("about.started.p1")}</p>
          <p style={{ marginBottom: 0 }}>{tr("about.started.p2")}</p>
        </div>

        <div className="intro-card">
          <h3>{tr("about.workshop.title")}</h3>
          <p>{tr("about.workshop.p1")}</p>
          <p style={{ marginBottom: 0 }}>{tr("about.workshop.p2")}</p>
        </div>

        <div className="intro-card">
          <h3>{tr("about.quality.title")}</h3>
          <p>{tr("about.quality.p1")}</p>
          <p style={{ marginBottom: 0 }}>{tr("about.quality.p2")}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{tr("about.principles.title")}</h2>
          <p>{tr("about.principles.lead")}</p>

          <ul style={{ marginTop: "0.8rem" }}>
            <li>
              <strong>{tr("about.principles.bullets.singleSource")}:</strong>{" "}
              {tr("about.principles.bullets.singleSourceBody")}
            </li>
            <li>
              <strong>{tr("about.principles.bullets.predictability")}:</strong>{" "}
              {tr("about.principles.bullets.predictabilityBody")}
            </li>
            <li>
              <strong>{tr("about.principles.bullets.respect")}:</strong>{" "}
              {tr("about.principles.bullets.respectBody")}
            </li>
            <li>
              <strong>{tr("about.principles.bullets.realWork")}:</strong>{" "}
              {tr("about.principles.bullets.realWorkBody")}
            </li>
          </ul>

          <p style={{ marginBottom: 0 }}>
            {tr("about.principles.outro")} <em>{tr("about.principles.outroEm")}</em>
          </p>
        </div>

        <div className="intro-card">
          <h3>{tr("about.deliver.title")}</h3>
          <p>{tr("about.deliver.p1")}</p>
          <p style={{ marginBottom: 0 }}>
            {tr("about.deliver.linkLead")}{" "}
            <Link to="/idebank">{tr("about.deliver.linkCta")}</Link>
          </p>
        </div>

        <div className="intro-card">
          <h3>{tr("about.direction.title")}</h3>
          <p>{tr("about.direction.p1")}</p>
          <p style={{ marginBottom: 0 }}>
            {tr("about.direction.linkLead")}{" "}
            <Link to="/progress">{tr("about.direction.linkCta")}</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
