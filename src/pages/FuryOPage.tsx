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

const FuryOPage: React.FC = () => {
  const { t, lang } = useI18n();
  const badges = lang === "en" ? storeBadges.en : storeBadges.no;

  return (
    <main className="page receipt-landing-page">
      <section
        className="receipt-landing-card fury-landing-card"
        aria-labelledby="fury-title"
      >
        <div className="receipt-landing-logo-wrap">
          <img
            className="fury-landing-logo"
            src={`${assetBase}fury-logo.png`}
            alt="Fury O"
          />
        </div>

        <h1 id="fury-title" className="receipt-landing-visually-hidden">
          FURY O
        </h1>
        <p className="fury-landing-tagline">{t("fury.tagline")}</p>
        <p className="receipt-landing-intro">{t("fury.intro")}</p>
        <p className="fury-landing-copy">{t("fury.gameplay")}</p>
        <p className="fury-landing-copy">{t("fury.modes")}</p>
        <p className="fury-landing-promise">{t("fury.promise")}</p>

        <section
          className="receipt-landing-download"
          aria-labelledby="fury-download-title"
        >
          <h2 id="fury-download-title">{t("fury.download.title")}</h2>

          <div className="receipt-store-badges">
            <a
              className="receipt-store-badge-link"
              href={LINKS.furyGooglePlay}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("fury.download.googleAria")}
            >
              <img
                className="receipt-store-badge-image"
                src={badges.google}
                alt={t("fury.download.googleAlt")}
              />
            </a>

            <a
              className="receipt-store-badge-link"
              href={LINKS.furyAppStore}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("fury.download.appleAria")}
            >
              <img
                className="receipt-store-badge-image"
                src={badges.apple}
                alt={t("fury.download.appleAlt")}
              />
            </a>
          </div>
        </section>

        <p className="receipt-landing-support">
          <span>{t("fury.support")}</span>
          <a href="mailto:support@morningcoffeelabs.no">
            support@morningcoffeelabs.no
          </a>
        </p>
      </section>
    </main>
  );
};

export default FuryOPage;
