// ReceiptPage.tsx
import React, { useEffect } from "react";
import { useI18n } from "../i18n/useI18n";

const assetBase = import.meta.env.BASE_URL || "/";

const googlePlayUrl =
  "https://play.google.com/store/apps/details?id=com.morningcoffeelabs.kvittek";

const appStoreUrl = "";

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

const ReceiptPage: React.FC = () => {
  const { t, lang } = useI18n();
  const activeLang = lang === "en" ? "en" : "no";
  const badges = activeLang === "en" ? storeBadges.en : storeBadges.no;

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

        <div className="receipt-store-badges">
          <a
            className="receipt-store-badge-link"
            href={googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              activeLang === "en"
                ? "Download Kvittek from Google Play"
                : "Last ned Kvittek fra Google Play"
            }
          >
            <img
              className="receipt-store-badge-image"
              src={badges.google}
              alt={
                activeLang === "en"
                  ? "Get it on Google Play"
                  : "Tilgjengelig på Google Play"
              }
            />
          </a>

          {appStoreUrl ? (
            <a
              className="receipt-store-badge-link"
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                activeLang === "en"
                  ? "Download Kvittek from the App Store"
                  : "Last ned Kvittek fra App Store"
              }
            >
              <img
                className="receipt-store-badge-image"
                src={badges.apple}
                alt={
                  activeLang === "en"
                    ? "Download on the App Store"
                    : "Last ned på App Store"
                }
              />
            </a>
          ) : (
            <button
              className="receipt-store-badge-link receipt-store-badge-disabled"
              type="button"
              disabled
              aria-label={
                activeLang === "en"
                  ? "App Store coming soon"
                  : "App Store kommer snart"
              }
            >
              <img
                className="receipt-store-badge-image"
                src={badges.apple}
                alt={
                  activeLang === "en"
                    ? "App Store coming soon"
                    : "App Store kommer snart"
                }
              />
            </button>
          )}
        </div>
      </section>

      {/* =============================== */}
      {/* BEFORE / AFTER */}
      {/* =============================== */}
      <section className="receipt-visual-grid">
        <div className="intro-card">
          <img
            src={`${assetBase}receipt-before.png`}
            alt={t("receipt.visual.before")}
            className="receipt-visual-image"
          />
        </div>

        <div className="intro-card">
          <img
            src={`${assetBase}receipt-after.png`}
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
      {/* FLOW – TOP ROW */}
      {/* =============================== */}
      <section className="receipt-flow-grid">
        <div className="receipt-flow-column">
          <div className="intro-card receipt-flow-card">
            <h3 className="receipt-flow-main-title">
              {t("receipt.flow.save.title")}
            </h3>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">
                {t("receipt.flow.save.capture.title")}
              </h4>
              <p>{t("receipt.flow.save.capture.body")}</p>
            </div>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">
                {t("receipt.flow.save.import.title")}
              </h4>
              <p>{t("receipt.flow.save.import.body")}</p>
            </div>
          </div>

          <div className="receipt-flow-arrow" aria-hidden="true" />
        </div>

        <div className="receipt-flow-column">
          <div className="intro-card receipt-flow-card">
            <h3 className="receipt-flow-main-title">
              {t("receipt.flow.store.title")}
            </h3>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">
                {t("receipt.flow.store.organized.title")}
              </h4>
              <p>{t("receipt.flow.store.organized.body1")}</p>
              <p>{t("receipt.flow.store.organized.body2")}</p>
            </div>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">
                {t("receipt.flow.store.autofill.title")}
              </h4>
              <p>{t("receipt.flow.store.autofill.body")}</p>
            </div>
          </div>

          <div className="receipt-flow-arrow" aria-hidden="true" />
        </div>

        <div className="receipt-flow-column">
          <div className="intro-card receipt-flow-card">
            <h3 className="receipt-flow-main-title">
              {t("receipt.flow.use.title")}
            </h3>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">
                {t("receipt.flow.use.whenNeeded.title")}
              </h4>
              <p>{t("receipt.flow.use.whenNeeded.body")}</p>
            </div>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">
                {t("receipt.flow.use.proof.title")}
              </h4>
              <p>{t("receipt.flow.use.proof.body")}</p>
            </div>

            <div className="receipt-flow-block">
              <h4 className="feature-sub">
                {t("receipt.flow.use.warranty.title")}
              </h4>
              <p>{t("receipt.flow.use.warranty.body")}</p>
            </div>
          </div>

          <div className="receipt-flow-arrow" aria-hidden="true" />
        </div>
      </section>

      {/* =============================== */}
      {/* FLOW – BOTTOM ROW */}
      {/* =============================== */}
      <section className="receipt-flow-bottom-grid">
        <div className="intro-card receipt-flow-target">
          <h3>{t("receipt.flow.bottom.safe.title")}</h3>
          <p>{t("receipt.flow.bottom.safe.body")}</p>
        </div>

        <div className="intro-card receipt-flow-target">
          <h3>{t("receipt.flow.bottom.product.title")}</h3>
          <p>{t("receipt.flow.bottom.product.body1")}</p>
          <p>{t("receipt.flow.bottom.product.body2")}</p>
        </div>

        <div className="intro-card receipt-flow-target">
          <h3>{t("receipt.flow.bottom.timing.title")}</h3>
          <p>{t("receipt.flow.bottom.timing.body")}</p>
        </div>
      </section>

      {/* =============================== */}
      {/* FINAL DOWNLOAD */}
      {/* =============================== */}
      <section className="receipt-cta receipt-cta-standalone">
        <div className="receipt-cta-inner">
          <h2>
            {activeLang === "en" ? "Download Kvittek" : "Last ned Kvittek"}
          </h2>

          <p className="receipt-cta-sub">
            {activeLang === "en"
              ? "Save, organize and find your receipts when you need them."
              : "Lagre, organiser og finn igjen kvitteringene når du trenger dem."}
          </p>

          <div className="receipt-store-badges">
            <a
              className="receipt-store-badge-link"
              href={googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                activeLang === "en"
                  ? "Download Kvittek from Google Play"
                  : "Last ned Kvittek fra Google Play"
              }
            >
              <img
                className="receipt-store-badge-image"
                src={badges.google}
                alt={
                  activeLang === "en"
                    ? "Get it on Google Play"
                    : "Tilgjengelig på Google Play"
                }
              />
            </a>

            {appStoreUrl ? (
              <a
                className="receipt-store-badge-link"
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  activeLang === "en"
                    ? "Download Kvittek from the App Store"
                    : "Last ned Kvittek fra App Store"
                }
              >
                <img
                  className="receipt-store-badge-image"
                  src={badges.apple}
                  alt={
                    activeLang === "en"
                      ? "Download on the App Store"
                      : "Last ned på App Store"
                  }
                />
              </a>
            ) : (
              <button
                className="receipt-store-badge-link receipt-store-badge-disabled"
                type="button"
                disabled
                aria-label={
                  activeLang === "en"
                    ? "App Store coming soon"
                    : "App Store kommer snart"
                }
              >
                <img
                  className="receipt-store-badge-image"
                  src={badges.apple}
                  alt={
                    activeLang === "en"
                      ? "App Store coming soon"
                      : "App Store kommer snart"
                  }
                />
              </button>
            )}
          </div>

          <p className="receipt-cta-note">
            {activeLang === "en"
              ? "Available on Google Play. App Store is coming soon."
              : "Tilgjengelig på Google Play. App Store kommer snart."}
          </p>
        </div>
      </section>
    </main>
  );
};

export default ReceiptPage;
