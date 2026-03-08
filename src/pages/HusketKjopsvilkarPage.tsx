import React from "react";
import { useI18n } from "../i18n/useI18n";

const HusketKjopsvilkarPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{t("husketLegal.purchase.title")}</h1>
        <p className="legal-intro">{t("husketLegal.purchase.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.purchase.s1.title")}</h2>
        <p>{t("husketLegal.purchase.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.purchase.s2.title")}</h2>
        <p>{t("husketLegal.purchase.s2.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.purchase.s3.title")}</h2>
        <p>{t("husketLegal.purchase.s3.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.purchase.s4.title")}</h2>
        <p>{t("husketLegal.purchase.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.purchase.s5.title")}</h2>
        <p>{t("husketLegal.purchase.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.purchase.s6.title")}</h2>
        <p>{t("husketLegal.purchase.s6.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.purchase.s7.title")}</h2>
        <p>{t("husketLegal.purchase.s7.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.purchase.s8.title")}</h2>
        <p>{t("husketLegal.purchase.s8.body")}</p>
      </section>
    </main>
  );
};

export default HusketKjopsvilkarPage;
