import React from "react";
import { useI18n } from "../i18n/useI18n";

const assetBase = import.meta.env.BASE_URL || "/";

const MosaicMePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="page project-preview-page mosaic-preview-page">
      <section className="project-preview-hero" aria-labelledby="mosaic-title">
        <img
          className="mosaic-preview-logo"
          src={`${assetBase}mosaic_me_logo.png`}
          alt="Mosaic ME"
        />
        <h1 id="mosaic-title" className="receipt-landing-visually-hidden">
          Mosaic ME
        </h1>
        <p className="project-preview-tagline">{t("mosaicPage.tagline")}</p>
        <p className="project-preview-lead">{t("mosaicPage.lead")}</p>

        <div className="project-preview-status">
          <img src={`${assetBase}mcl_under_construction.png`} alt="" />
          <div>
            <strong>{t("mosaicPage.status.title")}</strong>
            <span>{t("mosaicPage.status.body")}</span>
          </div>
        </div>
      </section>

      <section className="mosaic-story" aria-labelledby="mosaic-system-title">
        <h2 id="mosaic-system-title">{t("mosaicPage.system.title")}</h2>
        <p>{t("mosaicPage.system.bodyOne")}</p>
        <p>{t("mosaicPage.system.bodyTwo")}</p>
      </section>

      <div className="mosaic-principles">
        <section>
          <h2>{t("mosaicPage.private.title")}</h2>
          <p>{t("mosaicPage.private.body")}</p>
        </section>
        <section>
          <h2>{t("mosaicPage.sharing.title")}</h2>
          <p>{t("mosaicPage.sharing.body")}</p>
        </section>
        <section>
          <h2>{t("mosaicPage.data.title")}</h2>
          <p>{t("mosaicPage.data.body")}</p>
        </section>
      </div>

      <section className="mosaic-long-term" aria-labelledby="mosaic-long-term-title">
        <h2 id="mosaic-long-term-title">{t("mosaicPage.longTerm.title")}</h2>
        <p>{t("mosaicPage.longTerm.body")}</p>
        <strong>{t("mosaicPage.longTerm.free")}</strong>
      </section>

      <p className="receipt-landing-support project-preview-support">
        <span>{t("mosaicPage.support")}</span>
        <a href="mailto:support@morningcoffeelabs.no">
          support@morningcoffeelabs.no
        </a>
      </p>
    </main>
  );
};

export default MosaicMePage;
