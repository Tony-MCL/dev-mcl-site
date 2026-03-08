import React from "react";
import { useI18n } from "../i18n/useI18n";

const ContactPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page">
      <section className="fs-hero">
        <h1>{t("contact.title")}</h1>

        <p className="fs-tagline" style={{ maxWidth: 900 }}>
          {t("contact.tagline")}
        </p>

        <p style={{ maxWidth: 900, marginTop: "1rem" }}>
          {t("contact.emailLabel")}{" "}
          <a href="mailto:post@morningcoffeelabs.no">post@morningcoffeelabs.no</a>
        </p>

        <p style={{ maxWidth: 900 }}>
          {t("contact.phoneLabel")}{" "}
          <a href="tel:+4795097892">950&nbsp;97&nbsp;892</a>
        </p>
      </section>
    </main>
  );
};

export default ContactPage;
