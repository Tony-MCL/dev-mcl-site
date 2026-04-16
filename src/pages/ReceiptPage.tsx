import React, { useEffect } from "react";
import { useI18n } from "../i18n/useI18n";

const ReceiptPage: React.FC = () => {
  const { t } = useI18n();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="page receipt-page">
      {/* =============================== */}
      {/* HERO */}
      {/* =============================== */}
      <section className="fs-hero">
        <h1 className="hero-title">{t("receipt.hero.title")}</h1>
        <p className="hero-tagline">{t("receipt.hero.sub")}</p>
        <p className="hero-sub">{t("receipt.hero.line")}</p>

        <a
          href="mailto:post@morningcoffeelabs.no?subject=Interest%20in%20receipt%20app"
          className="hero-cta"
        >
          {t("receipt.cta.button")}
        </a>
      </section>

      {/* =============================== */}
      {/* BEFORE / AFTER */}
      {/* =============================== */}
      <section className="receipt-visual-grid">
        <div className="intro-card">
          <img
            src={`${import.meta.env.BASE_URL}receipt-before.png`}
            alt={t("receipt.visual.before")}
            className="receipt-visual-image"
          />
        </div>
      
        <div className="intro-card">
          <img
            src={`${import.meta.env.BASE_URL}receipt-after.png`}
            alt={t("receipt.visual.after")}
            className="receipt-visual-image"
          />
        </div>
      </section>

      {/* =============================== */}
      {/* PROBLEM */}
      {/* =============================== */}
      <section className="intro-card">
        <ul>
          <li>{t("receipt.problem.one")}</li>
          <li>{t("receipt.problem.two")}</li>
          <li>{t("receipt.problem.three")}</li>
          <li>{t("receipt.problem.four")}</li>
          <li>{t("receipt.problem.five")}</li>
        </ul>

        <p><strong>{t("receipt.problem.line1")}</strong></p>
        <p><strong>{t("receipt.problem.line2")}</strong></p>
      </section>

      {/* =============================== */}
      {/* HOW IT WORKS */}
      {/* =============================== */}
      <section className="intro-grid">
        <div className="intro-card">
          <h3>{t("receipt.how.save.title")}</h3>
          <p>{t("receipt.how.save.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("receipt.how.store.title")}</h3>
          <p>{t("receipt.how.store.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("receipt.how.use.title")}</h3>
          <p>{t("receipt.how.use.body")}</p>
        </div>
      </section>

      {/* =============================== */}
      {/* FEATURES */}
      {/* =============================== */}
      <section className="receipt-feature-columns">
  {/* COLUMN 1 */}
  <div className="intro-card">
    <h3>{t("receipt.how.save.title")}</h3>
    <p>{t("receipt.how.save.body")}</p>

    <h3 className="feature-sub">{t("receipt.features.capture.title")}</h3>
    <p>{t("receipt.features.capture.body")}</p>

    <h3 className="feature-sub">{t("receipt.features.import.title")}</h3>
    <p>{t("receipt.features.import.body")}</p>
  </div>

  {/* COLUMN 2 */}
  <div className="intro-card">
    <h3>{t("receipt.how.store.title")}</h3>
    <p>{t("receipt.how.store.body")}</p>

    <h3 className="feature-sub">{t("receipt.features.archive.title")}</h3>
    <p>{t("receipt.features.archive.body")}</p>

    <h3 className="feature-sub">{t("receipt.features.autofill.title")}</h3>
    <p>{t("receipt.features.autofill.body")}</p>
  </div>

  {/* COLUMN 3 */}
  <div className="intro-card">
    <h3>{t("receipt.how.use.title")}</h3>
    <p>{t("receipt.how.use.body")}</p>

    <h3 className="feature-sub">{t("receipt.features.share.title")}</h3>
    <p>{t("receipt.features.share.body")}</p>

    <h3 className="feature-sub">{t("receipt.features.warranty.title")}</h3>
    <p>{t("receipt.features.warranty.body")}</p>
  </div>
</section>

      {/* =============================== */}
      {/* MOMENT OF TRUTH */}
      {/* =============================== */}
      <section className="intro-card">
        <h3>{t("receipt.moment.title")}</h3>
        <p>{t("receipt.moment.body")}</p>
      </section>

      {/* =============================== */}
      {/* EXTRA */}
      {/* =============================== */}
      <section className="intro-card">
        <h3>{t("receipt.extra.title")}</h3>
        <p>{t("receipt.extra.body")}</p>
      </section>

      {/* =============================== */}
      {/* POSITIONING */}
      {/* =============================== */}
      <section className="intro-card">
        <h3>{t("receipt.positioning.title")}</h3>
        <p>{t("receipt.positioning.body")}</p>
      </section>

      {/* =============================== */}
      {/* FINAL CTA */}
      {/* =============================== */}
      <section className="receipt-cta">
        <div className="receipt-cta-inner">
          <h2>{t("receipt.cta.title")}</h2>
          <p className="receipt-cta-sub">{t("receipt.cta.sub")}</p>
      
          <a
            href="mailto:post@morningcoffeelabs.no?subject=Interest%20in%20receipt%20app"
            className="hero-cta receipt-cta-button"
          >
            {t("receipt.cta.button")}
          </a>
      
          <p className="receipt-cta-note">{t("receipt.cta.note")}</p>
        </div>
      </section>
    </main>
  );
};

export default ReceiptPage;
