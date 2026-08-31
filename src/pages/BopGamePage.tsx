import React from "react";
import { useI18n } from "../i18n/useI18n";

const assetBase = import.meta.env.BASE_URL || "/";

const BopGamePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page receipt-landing-page">
      <section
        className="receipt-landing-card bop-preview-card"
        aria-labelledby="bop-title"
      >
        <img
          className="bop-meet-image"
          src={`${assetBase}meet_BOP.png`}
          alt="Meet BOP"
        />
        <span className="section-kicker">{t("bopPage.kicker")}</span>
        <h1 id="bop-title">{t("bopPage.title")}</h1>
        <p className="bop-preview-tagline">{t("bopPage.tagline")}</p>
        <p className="receipt-landing-intro">{t("bopPage.body")}</p>
        <p className="bop-preview-note">{t("bopPage.note")}</p>

        <div className="project-preview-status bop-preview-status">
          <img src={`${assetBase}mcl_under_construction.png`} alt="" />
          <div>
            <strong>{t("bopPage.status.title")}</strong>
            <span>{t("bopPage.status.body")}</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BopGamePage;
