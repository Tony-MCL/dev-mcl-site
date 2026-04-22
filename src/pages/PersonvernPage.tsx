import React from "react";
import { useI18n } from "../i18n/useI18n";
import { getPageTextValue } from "../config/pageOverrides";

const PAGE_SLUG = "privacy" as const;

const PersonvernPage: React.FC = () => {
  const { t, lang } = useI18n();
  const tr = (key: string) => getPageTextValue(PAGE_SLUG, key, lang, t(key));

  const s2Bullets = [
    tr("legal.privacy.s2.bullets.0"),
    tr("legal.privacy.s2.bullets.1"),
    tr("legal.privacy.s2.bullets.2"),
    tr("legal.privacy.s2.bullets.3"),
  ];

  const s3Bullets = [
    tr("legal.privacy.s3.bullets.0"),
    tr("legal.privacy.s3.bullets.1"),
    tr("legal.privacy.s3.bullets.2"),
    tr("legal.privacy.s3.bullets.3"),
  ];

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{tr("legal.privacy.title")}</h1>
        <p className="legal-intro">{tr("legal.privacy.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.privacy.s1.title")}</h2>
        <p>{tr("legal.privacy.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.privacy.s2.title")}</h2>
        <p>{tr("legal.privacy.s2.lead")}</p>
        <ul>
          {s2Bullets.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.privacy.s3.title")}</h2>
        <p>{tr("legal.privacy.s3.lead")}</p>
        <ul>
          {s3Bullets.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.privacy.s4.title")}</h2>
        <p>{tr("legal.privacy.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.privacy.s5.title")}</h2>
        <p>{tr("legal.privacy.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.privacy.s6.title")}</h2>
        <p>{tr("legal.privacy.s6.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.privacy.s7.title")}</h2>
        <p>{tr("legal.privacy.s7.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.privacy.s8.title")}</h2>
        <p>{tr("legal.privacy.s8.body")}</p>
      </section>
    </main>
  );
};

export default PersonvernPage;
