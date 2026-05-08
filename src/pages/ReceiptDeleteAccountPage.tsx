import React from "react";
import { useI18n } from "../i18n/useI18n";

const ReceiptDeleteAccountPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page legal-page">
      <section className="legal-header">
        <h1>{t("receiptDeleteAccount.title")}</h1>
        <p className="legal-intro">{t("receiptDeleteAccount.intro")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("receiptDeleteAccount.s1.title")}</h2>
        <p>{t("receiptDeleteAccount.s1.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("receiptDeleteAccount.s2.title")}</h2>
        <p>{t("receiptDeleteAccount.s2.body")}</p>
      </section>

      <section className="legal-section">
        <h2>{t("receiptDeleteAccount.s3.title")}</h2>
        <p>
          {t("receiptDeleteAccount.s3.lead")}{" "}
          <a href="mailto:post@morningcoffeelabs.no">
            post@morningcoffeelabs.no
          </a>
        </p>
        <ul>
          <li>{t("receiptDeleteAccount.s3.bullets.0")}</li>
          <li>{t("receiptDeleteAccount.s3.bullets.1")}</li>
          <li>{t("receiptDeleteAccount.s3.bullets.2")}</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>{t("receiptDeleteAccount.s4.title")}</h2>
        <p>{t("receiptDeleteAccount.s4.body")}</p>
      </section>
    </main>
  );
};

export default ReceiptDeleteAccountPage;
