import React from "react";
import { useI18n } from "../i18n/useI18n";
import { getPageTextValue } from "../config/pageOverrides";

const PAGE_SLUG = "terms" as const;

const BrukervilkarPage: React.FC = () => {
  const { t, lang } = useI18n();
  const tr = (key: string) => getPageTextValue(PAGE_SLUG, key, lang, t(key));

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{tr("legal.terms.title")}</h1>
        <p className="legal-intro">{tr("legal.terms.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.terms.s1.title")}</h2>
        <p>{tr("legal.terms.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.terms.s2.title")}</h2>
        <p>{tr("legal.terms.s2.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.terms.s3.title")}</h2>
        <p>{tr("legal.terms.s3.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.terms.s4.title")}</h2>
        <p>{tr("legal.terms.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.terms.s5.title")}</h2>
        <p>{tr("legal.terms.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.terms.s6.title")}</h2>
        <p>{tr("legal.terms.s6.body")}</p>
      </section>
    </main>
  );
};

export default BrukervilkarPage;
