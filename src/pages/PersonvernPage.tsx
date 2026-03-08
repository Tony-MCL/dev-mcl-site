import React from "react";
import { useI18n } from "../i18n/useI18n";

const PersonvernPage: React.FC = () => {
  const { t } = useI18n();

  const s2Bullets = (t("legal.privacy.s2.bullets") as unknown) as string[];
  const s3Bullets = (t("legal.privacy.s3.bullets") as unknown) as string[];

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{t("legal.privacy.title")}</h1>
        <p className="legal-intro">{t("legal.privacy.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.privacy.s1.title")}</h2>
        <p>{t("legal.privacy.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.privacy.s2.title")}</h2>
        <p>{t("legal.privacy.s2.lead")}</p>
        <ul>
          {Array.isArray(s2Bullets) ? s2Bullets.map((x, i) => <li key={i}>{x}</li>) : null}
        </ul>
      </section>

      <section className="legal-section">
        <h2>{t("legal.privacy.s3.title")}</h2>
        <p>{t("legal.privacy.s3.lead")}</p>
        <ul>
          {Array.isArray(s3Bullets) ? s3Bullets.map((x, i) => <li key={i}>{x}</li>) : null}
        </ul>
      </section>

      <section className="legal-section">
        <h2>{t("legal.privacy.s4.title")}</h2>
        <p>{t("legal.privacy.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.privacy.s5.title")}</h2>
        <p>{t("legal.privacy.s5.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.privacy.s6.title")}</h2>
        <p>{t("legal.privacy.s6.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.privacy.s7.title")}</h2>
        <p>{t("legal.privacy.s7.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.privacy.s8.title")}</h2>
        <p>{t("legal.privacy.s8.body")}</p>
      </section>
    </main>
  );
};

export default PersonvernPage;
