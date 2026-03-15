import React, { useEffect } from "react";
import { useI18n } from "../i18n/useI18n";

const HusketPage: React.FC = () => {
  const { t } = useI18n();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="page husket-page">
      {/* =============================== */}
      {/* HERO */}
      {/* =============================== */}
      <section className="husket-hero-layout">
        <div className="husket-logo-wrap" aria-hidden="true">
          <img
            src={`${import.meta.env.BASE_URL}husketlogo.svg`}
            alt="husk'et"
            className="husket-logo-image"
          />
        </div>

        <div className="husket-hero-copy">
          <p className="husket-hero-tagline">{t("husket.hero.tagline")}</p>
          <p className="husket-hero-intro">{t("husket.hero.intro")}</p>
        </div>
      </section>

      {/* =============================== */}
      {/* QUICK GLIMPSE */}
      {/* =============================== */}
      <section className="intro-card">
        <h3 style={{ marginTop: 0 }}>{t("husket.glimpse.title")}</h3>

        <div className="husket-glimpse-grid">
          <figure className="husket-glimpse-card">
            <img
              src={`${import.meta.env.BASE_URL}husket-screen-1.png`}
              alt={t("husket.glimpse.alt.one")}
              className="husket-glimpse-image"
            />
            <figcaption className="husket-glimpse-caption">
              {t("husket.glimpse.caption.one")}
            </figcaption>
          </figure>

          <figure className="husket-glimpse-card">
            <img
              src={`${import.meta.env.BASE_URL}husket-screen-2.png`}
              alt={t("husket.glimpse.alt.two")}
              className="husket-glimpse-image"
            />
            <figcaption className="husket-glimpse-caption">
              {t("husket.glimpse.caption.two")}
            </figcaption>
          </figure>

          <figure className="husket-glimpse-card">
            <img
              src={`${import.meta.env.BASE_URL}husket-screen-3.png`}
              alt={t("husket.glimpse.alt.three")}
              className="husket-glimpse-image"
            />
            <figcaption className="husket-glimpse-caption">
              {t("husket.glimpse.caption.three")}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* =============================== */}
      {/* CONTENT */}
      {/* =============================== */}
      <section className="intro-grid two-columns">
        <div className="intro-card">
          <h3>{t("husket.cards.capture.title")}</h3>
          <p>{t("husket.cards.capture.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("husket.cards.structure.title")}</h3>
          <p>{t("husket.cards.structure.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("husket.cards.offline.title")}</h3>
          <p>{t("husket.cards.offline.body")}</p>
        </div>

        <div className="intro-card">
          <h3>{t("husket.cards.privacy.title")}</h3>
          <p>{t("husket.cards.privacy.body")}</p>
        </div>

        {/* =============================== */}
        {/* NEXT / COMING SOON */}
        {/* =============================== */}
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{t("husket.next.title")}</h3>
        
          <p style={{ marginBottom: "1rem" }}>{t("husket.next.body")}</p>
        
          <a
            href="https://groups.google.com/g/husket-testpanel/about"
            target="_blank"
            rel="noopener noreferrer"
            className="primary-button"
          >
            {t("husket.next.cta")}
          </a>
        </div>
      </section>
    </main>
  );
};

export default HusketPage;
