import React from "react";
import { useI18n } from "../i18n/useI18n";
import { getPageTextValue } from "../config/pageOverrides";

const PAGE_SLUG = "purchase" as const;

const KjopsvilkarPage: React.FC = () => {
  const { t, lang } = useI18n();
  const tr = (key: string) => getPageTextValue(PAGE_SLUG, key, lang, t(key));

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{tr("legal.purchase.title")}</h1>
        <p className="legal-intro">{tr("legal.purchase.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.purchase.s1.title")}</h2>
        <p>{tr("legal.purchase.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.purchase.s2.title")}</h2>
        <p>{tr("legal.purchase.s2.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.purchase.s3.title")}</h2>
        <p>{tr("legal.purchase.s3.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.purchase.s4.title")}</h2>
        <p>{tr("legal.purchase.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.purchase.s5.title")}</h2>
        <p>{tr("legal.purchase.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.purchase.s6.title")}</h2>
        <p>{tr("legal.purchase.s6.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.purchase.s7.title")}</h2>
        <p>{tr("legal.purchase.s7.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.purchase.s8.title")}</h2>
        <p>{tr("legal.purchase.s8.body")}</p>
      </section>
    </main>
  );
};

export default KjopsvilkarPage;
