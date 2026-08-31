import React from "react";
import { LINKS } from "../config/links";
import { useI18n } from "../i18n/useI18n";

const assetBase = import.meta.env.BASE_URL || "/";

const storeBadges = {
  no: `${assetBase}google-play-badge-no.svg`,
  en: `${assetBase}google-play-badge-en.svg`,
} as const;

const HusketPage: React.FC = () => {
  const { t, lang } = useI18n();
  const badge = lang === "en" ? storeBadges.en : storeBadges.no;

  return (
    <main className="page receipt-landing-page">
      <section
        className="receipt-landing-card husket-landing-card"
        aria-labelledby="husket-title"
      >
        <div className="receipt-landing-logo-wrap">
          <img
            className="husket-landing-logo"
            src={`${assetBase}husketlogo.svg`}
            alt="husk'et"
          />
        </div>

        <h1 id="husket-title" className="receipt-landing-visually-hidden">
          {t("husket.hero.title")}
        </h1>

        <p className="husket-landing-tagline">{t("husket.hero.tagline")}</p>
        <p className="receipt-landing-intro">{t("husket.hero.intro")}</p>

        <section
          className="receipt-landing-download"
          aria-labelledby="husket-download-title"
        >
          <h2 id="husket-download-title">{t("husket.download.title")}</h2>

          <div className="receipt-store-badges">
            <a
              className="receipt-store-badge-link"
              href={LINKS.husketGooglePlay}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("husket.download.googleAria")}
            >
              <img
                className="receipt-store-badge-image"
                src={badge}
                alt={t("husket.download.googleAlt")}
              />
            </a>
          </div>
        </section>

        <p className="receipt-landing-support">
          <span>{t("husket.support")}</span>
          <a href="mailto:support@morningcoffeelabs.no">
            support@morningcoffeelabs.no
          </a>
        </p>
      </section>
    </main>
  );
};

export default HusketPage;
