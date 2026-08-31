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
          className="bop-construction-image"
          src={`${assetBase}mcl_under_construction.png`}
          alt=""
        />
        <span className="section-kicker">{t("bopPage.kicker")}</span>
        <h1 id="bop-title">{t("bopPage.title")}</h1>
        <p className="bop-preview-tagline">{t("bopPage.tagline")}</p>
        <p className="receipt-landing-intro">{t("bopPage.body")}</p>
        <p className="bop-preview-note">{t("bopPage.note")}</p>
      </section>
    </main>
  );
};

export default BopGamePage;
