import React from "react";
import { LINKS } from "../config/links";
import { useI18n } from "../i18n/useI18n";

const assetBase = import.meta.env.BASE_URL || "/";

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

const FindBackPage: React.FC = () => {
  const { t, lang } = useI18n();
  const badges = lang === "en" ? storeBadges.en : storeBadges.no;

  return (
    <main className="page receipt-landing-page">
      <section
        className="receipt-landing-card findback-landing-card"
        aria-labelledby="findback-title"
      >
        <div className="receipt-landing-logo-wrap">
          <img
            className="findback-landing-logo"
            src={`${assetBase}findback-icon.png`}
            alt="FindBack"
          />
        </div>

        <h1 id="findback-title">{t("findback.title")}</h1>
        <p className="receipt-landing-intro">{t("findback.intro")}</p>
        <p className="findback-landing-purpose">{t("findback.purpose")}</p>
        <p className="findback-landing-how">{t("findback.how")}</p>
        <p className="findback-landing-promise">{t("findback.promise")}</p>
        <p className="findback-landing-privacy">{t("findback.privacy")}</p>

        <section
          className="receipt-landing-download"
          aria-labelledby="findback-download-title"
        >
          <h2 id="findback-download-title">{t("findback.download.title")}</h2>

          <div className="receipt-store-badges">
            <a
              className="receipt-store-badge-link"
              href={LINKS.findbackGooglePlay}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("findback.download.googleAria")}
            >
              <img
                className="receipt-store-badge-image"
                src={badges.google}
                alt={t("findback.download.googleAlt")}
              />
            </a>

            <a
              className="receipt-store-badge-link"
              href={LINKS.findbackAppStore}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("findback.download.appleAria")}
            >
              <img
                className="receipt-store-badge-image"
                src={badges.apple}
                alt={t("findback.download.appleAlt")}
              />
            </a>
          </div>
        </section>

        <p className="receipt-landing-support">
          <span>{t("findback.support")}</span>
          <a href="mailto:support@morningcoffeelabs.no">
            support@morningcoffeelabs.no
          </a>
        </p>
      </section>
    </main>
  );
};

export default FindBackPage;
