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

        <p>
          <strong>{t("receipt.problem.line1")}</strong>
        </p>
        <p>
          <strong>{t("receipt.problem.line2")}</strong>
        </p>
      </section>

      {/* =============================== */}
      {/* FLOW */}
      {/* =============================== */}
      <section className="receipt-flow-grid">
        {/* COLUMN 1 */}
        <div className="receipt-flow-column">
          <div className="intro-card receipt-flow-card">
            <h3 className="receipt-flow-main-title">
              {t("receipt.flow.save.title")}
            </h3>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">{t("receipt.flow.save.capture.title")}</h4>
              <p>{t("receipt.flow.save.capture.body")}</p>
            </div>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">{t("receipt.flow.save.import.title")}</h4>
              <p>{t("receipt.flow.save.import.body")}</p>
            </div>
          </div>

          <div className="receipt-flow-arrow" aria-hidden="true" />

          <div className="intro-card receipt-flow-target">
            <h3>{t("receipt.flow.bottom.safe.title")}</h3>
            <p>{t("receipt.flow.bottom.safe.body")}</p>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="receipt-flow-column">
          <div className="intro-card receipt-flow-card">
            <h3 className="receipt-flow-main-title">
              {t("receipt.flow.store.title")}
            </h3>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">{t("receipt.flow.store.organized.title")}</h4>
              <p>{t("receipt.flow.store.organized.body1")}</p>
              <p>{t("receipt.flow.store.organized.body2")}</p>
            </div>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">{t("receipt.flow.store.autofill.title")}</h4>
              <p>{t("receipt.flow.store.autofill.body")}</p>
            </div>
          </div>

          <div className="receipt-flow-arrow" aria-hidden="true" />

          <div className="intro-card receipt-flow-target">
            <h3>{t("receipt.flow.bottom.product.title")}</h3>
            <p>{t("receipt.flow.bottom.product.body1")}</p>
            <p>{t("receipt.flow.bottom.product.body2")}</p>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div className="receipt-flow-column">
          <div className="intro-card receipt-flow-card">
            <h3 className="receipt-flow-main-title">
              {t("receipt.flow.use.title")}
            </h3>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">{t("receipt.flow.use.whenNeeded.title")}</h4>
              <p>{t("receipt.flow.use.whenNeeded.body")}</p>
            </div>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">{t("receipt.flow.use.proof.title")}</h4>
              <p>{t("receipt.flow.use.proof.body")}</p>
            </div>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">{t("receipt.flow.use.warranty.title")}</h4>
              <p>{t("receipt.flow.use.warranty.body")}</p>
            </div>
          </div>

          <div className="receipt-flow-arrow" aria-hidden="true" />

          <div className="intro-card receipt-flow-target">
            <h3>{t("receipt.flow.bottom.timing.title")}</h3>
            <p>{t("receipt.flow.bottom.timing.body")}</p>
          </div>
        </div>
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
