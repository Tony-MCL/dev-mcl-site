import React from "react";
import { useI18n } from "../i18n/useI18n";
import { getPageTextValue } from "../config/pageOverrides";

const PAGE_SLUG = "contact" as const;

const ContactPage: React.FC = () => {
  const { t, lang } = useI18n();
  const tr = (key: string) => getPageTextValue(PAGE_SLUG, key, lang, t(key));

  return (
    <main className="page">
      <section className="fs-hero">
        <h1>{tr("contact.title")}</h1>

        <p className="fs-tagline" style={{ maxWidth: 900 }}>
          {tr("contact.tagline")}
        </p>

        <p style={{ maxWidth: 900, marginTop: "1rem" }}>
          {tr("contact.emailLabel")}{" "}
          <a href="mailto:post@morningcoffeelabs.no">post@morningcoffeelabs.no</a>
        </p>

        <p style={{ maxWidth: 900 }}>
          {tr("contact.phoneLabel")}{" "}
          <a href="tel:+4795097892">950&nbsp;97&nbsp;892</a>
        </p>
      </section>
    </main>
  );
};

export default ContactPage;
