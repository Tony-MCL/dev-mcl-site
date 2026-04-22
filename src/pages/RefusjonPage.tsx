import React from "react";
import { useI18n } from "../i18n/useI18n";
import { getPageTextValue } from "../config/pageOverrides";

const PAGE_SLUG = "refund" as const;

const RefusjonPage: React.FC = () => {
  const { t, lang } = useI18n();
  const tr = (key: string) => getPageTextValue(PAGE_SLUG, key, lang, t(key));

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{tr("legal.refund.title")}</h1>
        <p className="legal-intro">{tr("legal.refund.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.refund.s1.title")}</h2>
        <p>{tr("legal.refund.s1.p1")}</p>
        <ul>
          <li>{tr("legal.refund.s1.bullets.0")}</li>
          <li>{tr("legal.refund.s1.bullets.1")}</li>
        </ul>
        <p>{tr("legal.refund.s1.p2")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.refund.s2.title")}</h2>
        <p>{tr("legal.refund.s2.p1")}</p>
        <ul>
          <li>{tr("legal.refund.s2.bullets.0")}</li>
          <li>{tr("legal.refund.s2.bullets.1")}</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.refund.s3.title")}</h2>
        <p>{tr("legal.refund.s3.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.refund.s4.title")}</h2>
        <p>{tr("legal.refund.s4.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{tr("legal.refund.s5.title")}</h2>
        <p>
          {tr("legal.refund.s5.lead")}{" "}
          <a href="mailto:post@morningcoffeelabs.no">post@morningcoffeelabs.no</a>{" "}
          {tr("legal.refund.s5.bodyAfterEmail")}
        </p>
        <ul>
          <li>{tr("legal.refund.s5.bullets.0")}</li>
          <li>{tr("legal.refund.s5.bullets.1")}</li>
          <li>{tr("legal.refund.s5.bullets.2")}</li>
          <li>{tr("legal.refund.s5.bullets.3")}</li>
        </ul>
      </section>
    </main>
  );
};

export default RefusjonPage;
