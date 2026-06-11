import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

const assetBase = import.meta.env.BASE_URL || "/";
const kvittekLogoLight = `${assetBase}kvittek-logo-dark.png`;
const kvittekLogoDark = `${assetBase}kvittek-logo-light.png`;

const storeBadges = {
  no: {
    google: `${assetBase}google-play-badge-no.svg`,
    apple: `${assetBase}app-store-badge-no.svg`,
  },
  en: {
    google: `${assetBase}google-play-badge-en.svg`,
    apple: `${assetBase}app-store-badge-en.svg`,
  },
} as const;

const fallbackProblems = {
  no: [
    "Kvitteringer i skuffer",
    "Leting i lommer og mapper",
    "Stress når du plutselig trenger dokumentasjon",
  ],
  en: [
    "Receipts in drawers",
    "Digging in pockets and folders",
    "Stress when you suddenly need documentation",
  ],
} as const;

const fallbackBenefits = {
  no: [
    "Garanti og reklamasjon",
    "Jobb- og reiseregninger",
    "Utlegg og refusjoner",
    "Organisering av kvitteringer",
    "Sikker lagring og backup",
  ],
  en: [
    "Warranties and returns",
    "Work and travel expenses",
    "Reimbursements and claims",
    "Organizing your receipts",
    "Secure storage and backup",
  ],
} as const;

function readStringList(value: unknown, fallback: readonly string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [...fallback];
}

const ReceiptLandingPage: React.FC = () => {
  const { t, lang } = useI18n();
  const activeLang = lang === "en" ? "en" : "no";
  const problems = readStringList(t("kvittekLanding.problems.items"), fallbackProblems[activeLang]);
  const benefits = readStringList(t("kvittekLanding.benefits.items"), fallbackBenefits[activeLang]);
  const badges = activeLang === "en" ? storeBadges.en : storeBadges.no;

  return (
    <main className="page receipt-landing-page">
      <section className="receipt-landing-card" aria-labelledby="kvittek-title">
        <div className="receipt-landing-logo-wrap">
          <img
            className="receipt-landing-logo receipt-landing-logo-dark"
            src={kvittekLogoDark}
            alt="Kvittek"
          />
          <img
            className="receipt-landing-logo receipt-landing-logo-light"
            src={kvittekLogoLight}
            alt=""
            aria-hidden="true"
          />
        </div>

        <h1 id="kvittek-title">{t("kvittekLanding.title")}</h1>

        <p className="receipt-landing-intro">{t("kvittekLanding.intro")}</p>

        <section
          className="receipt-landing-list-card receipt-landing-problem-card"
          aria-labelledby="kvittek-problems-title"
        >
          <h2 id="kvittek-problems-title" className="receipt-landing-visually-hidden">
            {t("kvittekLanding.problems.title")}
          </h2>

          <ul>
            {Array.isArray(problems)
              ? problems.map((item) => (
                  <li key={item}>
                    <span className="receipt-landing-list-icon receipt-landing-list-icon-bad" aria-hidden="true">
                      ×
                    </span>
                    <span>{item}</span>
                  </li>
                ))
              : null}
          </ul>
        </section>

        <section
          className="receipt-landing-list-card receipt-landing-benefit-card"
          aria-labelledby="kvittek-benefits-title"
        >
          <h2 id="kvittek-benefits-title">{t("kvittekLanding.benefits.title")}</h2>

          <ul>
            {Array.isArray(benefits)
              ? benefits.map((item) => (
                  <li key={item}>
                    <span className="receipt-landing-list-icon receipt-landing-list-icon-good" aria-hidden="true">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))
              : null}
          </ul>
        </section>

        <p className="receipt-landing-reminder">{t("kvittekLanding.reminder")}</p>

        <section className="receipt-landing-download" aria-labelledby="kvittek-download-title">
          <h2 id="kvittek-download-title">{t("kvittekLanding.download.title")}</h2>

          <div className="receipt-store-badges">
            <a
              className="receipt-store-badge-link"
              href={LINKS.kvittekGooglePlay}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("kvittekLanding.download.googleAria")}
            >
              <img
                className="receipt-store-badge-image"
                src={badges.google}
                alt={t("kvittekLanding.download.googleAlt")}
              />
            </a>

            {LINKS.kvittekAppStore ? (
              <a
                className="receipt-store-badge-link"
                href={LINKS.kvittekAppStore}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("kvittekLanding.download.appleAria")}
              >
                <img
                  className="receipt-store-badge-image"
                  src={badges.apple}
                  alt={t("kvittekLanding.download.appleAlt")}
                />
              </a>
            ) : (
              <button
                className="receipt-store-badge-link receipt-store-badge-disabled"
                type="button"
                disabled
                aria-label={t("kvittekLanding.download.appleSoon")}
              >
                <img
                  className="receipt-store-badge-image"
                  src={badges.apple}
                  alt={t("kvittekLanding.download.appleSoon")}
                />
              </button>
            )}
          </div>
        </section>

        <p className="receipt-landing-support">
          <span>{t("kvittekLanding.support.lead")}</span>
          <a href="mailto:support@morningcoffeelabs.no">support@morningcoffeelabs.no</a>
        </p>

        <p className="receipt-landing-product-link">
          <Link to="/kvittek">{t("kvittekLanding.more")}</Link>
        </p>
      </section>
    </main>
  );
};

export default ReceiptLandingPage;
