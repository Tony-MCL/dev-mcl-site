import React from "react";
import { useI18n } from "../i18n/useI18n";

const KjopsvilkarPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{t("legal.purchase.title")}</h1>
        <p className="legal-intro">{t("legal.purchase.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.purchase.s1.title")}</h2>
        <p>{t("legal.purchase.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.purchase.s2.title")}</h2>
        <p>{t("legal.purchase.s2.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.purchase.s3.title")}</h2>
        <p>{t("legal.purchase.s3.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.purchase.s4.title")}</h2>
        <p>{t("legal.purchase.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.purchase.s5.title")}</h2>
        <p>{t("legal.purchase.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.purchase.s6.title")}</h2>
        <p>{t("legal.purchase.s6.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.purchase.s7.title")}</h2>
        <p>{t("legal.purchase.s7.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.purchase.s8.title")}</h2>
        <p>{t("legal.purchase.s8.body")}</p>
      </section>
    </main>
  );
};

export default KjopsvilkarPage;
