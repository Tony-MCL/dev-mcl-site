import React from "react";
import { useI18n } from "../i18n/useI18n";

const RefusjonPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page legal-page">
      <section className="legal-hero">
        <h1>{t("legal.refund.title")}</h1>
        <p className="legal-intro">{t("legal.refund.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.refund.s1.title")}</h2>
        <p>{t("legal.refund.s1.p1")}</p>
        <ul>
          <li>{t("legal.refund.s1.bullets.0")}</li>
          <li>{t("legal.refund.s1.bullets.1")}</li>
        </ul>
        <p>{t("legal.refund.s1.p2")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.refund.s2.title")}</h2>
        <p>{t("legal.refund.s2.p1")}</p>
        <ul>
          <li>{t("legal.refund.s2.bullets.0")}</li>
          <li>{t("legal.refund.s2.bullets.1")}</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>{t("legal.refund.s3.title")}</h2>
        <p>{t("legal.refund.s3.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.refund.s4.title")}</h2>
        <p>{t("legal.refund.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("legal.refund.s5.title")}</h2>
        <p>
          {t("legal.refund.s5.lead")}{" "}
          <a href="mailto:post@morningcoffeelabs.no">post@morningcoffeelabs.no</a>{" "}
          {t("legal.refund.s5.bodyAfterEmail")}
        </p>
        <ul>
          <li>{t("legal.refund.s5.bullets.0")}</li>
          <li>{t("legal.refund.s5.bullets.1")}</li>
          <li>{t("legal.refund.s5.bullets.2")}</li>
          <li>{t("legal.refund.s5.bullets.3")}</li>
        </ul>
      </section>
    </main>
  );
};

export default RefusjonPage;
