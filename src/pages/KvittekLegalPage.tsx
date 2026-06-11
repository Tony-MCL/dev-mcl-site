import React from "react";
import { useI18n } from "../i18n/useI18n";

type LegalType = "purchase" | "terms" | "privacy" | "refund";

type Props = {
  type: LegalType;
};

type Section = {
  title: string;
  body?: string;
  lead?: string;
  bullets?: string[];
};

const KvittekLegalPage: React.FC<Props> = ({ type }) => {
  const { t } = useI18n();
  const base = `kvittekLegal.${type}`;
  const sections = t(`${base}.sections`) as unknown as Section[];

  return (
    <main className="page legal-page kvittek-legal-page">
      <section className="fs-hero">
        <h1>{t(`${base}.title`)}</h1>
        <p className="fs-tagline">{t(`${base}.intro`)}</p>
      </section>

      <section className="legal-content-card">
        {Array.isArray(sections)
          ? sections.map((section) => (
              <section className="legal-section" key={section.title}>
                <h2>{section.title}</h2>

                {section.body ? <p>{section.body}</p> : null}
                {section.lead ? <p>{section.lead}</p> : null}

                {Array.isArray(section.bullets) ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))
          : null}
      </section>
    </main>
  );
};

export default KvittekLegalPage;
