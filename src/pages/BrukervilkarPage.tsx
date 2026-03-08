import React from "react";
import { useI18n } from "../i18n/useI18n";

const BrukervilkarPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{t("legal.terms.title")}</h1>
        <p className="legal-intro">{t("legal.terms.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.terms.s1.title")}</h2>
        <p>{t("legal.terms.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.terms.s2.title")}</h2>
        <p>{t("legal.terms.s2.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.terms.s3.title")}</h2>
        <p>{t("legal.terms.s3.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.terms.s4.title")}</h2>
        <p>{t("legal.terms.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.terms.s5.title")}</h2>
        <p>{t("legal.terms.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.terms.s6.title")}</h2>
        <p>{t("legal.terms.s6.body")}</p>
      </section>
    </main>
  );
};

export default BrukervilkarPage;
