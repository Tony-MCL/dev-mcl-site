import React from "react";
import { useI18n } from "../i18n/useI18n";

const HusketBrukervilkarPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{t("husketLegal.terms.title")}</h1>
        <p className="legal-intro">{t("husketLegal.terms.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.terms.s1.title")}</h2>
        <p>{t("husketLegal.terms.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.terms.s2.title")}</h2>
        <p>{t("husketLegal.terms.s2.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.terms.s3.title")}</h2>
        <p>{t("husketLegal.terms.s3.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.terms.s4.title")}</h2>
        <p>{t("husketLegal.terms.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.terms.s5.title")}</h2>
        <p>{t("husketLegal.terms.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.terms.s6.title")}</h2>
        <p>{t("husketLegal.terms.s6.body")}</p>
      </section>
    </main>
  );
};

export default HusketBrukervilkarPage;
