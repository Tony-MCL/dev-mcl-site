import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

const assetBase = import.meta.env.BASE_URL || "/";
const kvittekLogoLight = `${assetBase}kvittek-logo-light.png`;
const kvittekLogoDark = `${assetBase}kvittek-logo-dark.png`;

const ReceiptLandingPage: React.FC = () => {
  const { t } = useI18n();
  const benefits = t("kvittekLanding.benefits.items") as unknown as string[];

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

        <p className="receipt-landing-kicker">{t("kvittekLanding.kicker")}</p>
        <h1 id="kvittek-title">{t("kvittekLanding.title")}</h1>

        <p className="receipt-landing-intro">{t("kvittekLanding.intro")}</p>

        <div className="receipt-landing-problems" aria-label={t("kvittekLanding.problems.aria")}> 
          <span>{t("kvittekLanding.problems.drawer")}</span>
          <span>{t("kvittekLanding.problems.searching")}</span>
          <span>{t("kvittekLanding.problems.stress")}</span>
        </div>

        <section className="receipt-landing-benefits" aria-labelledby="kvittek-benefits-title">
          <h2 id="kvittek-benefits-title">{t("kvittekLanding.benefits.title")}</h2>

          <ul>
            {Array.isArray(benefits)
              ? benefits.map((item) => <li key={item}>{item}</li>)
              : null}
          </ul>
        </section>

        <p className="receipt-landing-reminder">{t("kvittekLanding.reminder")}</p>

        <section className="receipt-landing-download" aria-labelledby="kvittek-download-title">
          <h2 id="kvittek-download-title">{t("kvittekLanding.download.title")}</h2>

          <div className="receipt-store-buttons">
            <a
              className="receipt-store-button receipt-store-button-primary"
              href={LINKS.kvittekGooglePlay}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{t("kvittekLanding.download.googleSmall")}</span>
              <strong>{t("kvittekLanding.download.google")}</strong>
            </a>

            {LINKS.kvittekAppStore ? (
              <a
                className="receipt-store-button"
                href={LINKS.kvittekAppStore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t("kvittekLanding.download.appleSmall")}</span>
                <strong>{t("kvittekLanding.download.apple")}</strong>
              </a>
            ) : (
              <button className="receipt-store-button receipt-store-button-disabled" type="button" disabled>
                <span>{t("kvittekLanding.download.appleSmall")}</span>
                <strong>{t("kvittekLanding.download.appleSoon")}</strong>
              </button>
            )}
          </div>
        </section>

        <p className="receipt-landing-support">
          {t("kvittekLanding.support.lead")} {" "}
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
