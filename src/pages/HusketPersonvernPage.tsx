import React from "react";
import { useI18n } from "../i18n/useI18n";

const HusketPersonvernPage: React.FC = () => {
  const { t } = useI18n();

  const s2Bullets = (t("husketLegal.privacy.s2.bullets") as unknown) as string[];
  const s3Bullets = (t("husketLegal.privacy.s3.bullets") as unknown) as string[];

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{t("husketLegal.privacy.title")}</h1>
        <p className="legal-intro">{t("husketLegal.privacy.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.privacy.s1.title")}</h2>
        <p>{t("husketLegal.privacy.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.privacy.s2.title")}</h2>
        <p>{t("husketLegal.privacy.s2.lead")}</p>
        <ul>
          {Array.isArray(s2Bullets) ? s2Bullets.map((x, i) => <li key={i}>{x}</li>) : null}
        </ul>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.privacy.s3.title")}</h2>
        <p>{t("husketLegal.privacy.s3.lead")}</p>
        <ul>
          {Array.isArray(s3Bullets) ? s3Bullets.map((x, i) => <li key={i}>{x}</li>) : null}
        </ul>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.privacy.s4.title")}</h2>
        <p>{t("husketLegal.privacy.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.privacy.s5.title")}</h2>
        <p>{t("husketLegal.privacy.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.privacy.s6.title")}</h2>
        <p>{t("husketLegal.privacy.s6.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.privacy.s7.title")}</h2>
        <p>{t("husketLegal.privacy.s7.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("husketLegal.privacy.s8.title")}</h2>
        <p>{t("husketLegal.privacy.s8.body")}</p>
      </section>
    </main>
  );
};

export default HusketPersonvernPage;
