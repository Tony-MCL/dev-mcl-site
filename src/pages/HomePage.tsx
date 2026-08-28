import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const assetBase = import.meta.env.BASE_URL || "/";

type ProductCardProps = {
  name: string;
  description: string;
  image?: string;
  imageClassName?: string;
  accent: string;
  eyebrow: string;
  href?: string;
  cta?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ name, description, image, imageClassName = "", accent, eyebrow, href, cta }) => {
  const content = <>
    <div className="product-card-media" style={{ "--product-accent": accent } as React.CSSProperties}>
      {image ? <img className={imageClassName} src={`${assetBase}${image}`} alt={`${name} logo`} /> : <div className="media-placeholder" aria-hidden="true"><span>{name.charAt(0)}</span></div>}
    </div>
    <div className="product-card-copy">
      <span className="section-kicker">{eyebrow}</span>
      <h3>{name}</h3>
      <p>{description}</p>
      {cta ? <span className="text-link">{cta} <span aria-hidden="true">→</span></span> : null}
    </div>
  </>;

  return href ? <Link className="product-card product-card-link" to={href}>{content}</Link> : <article className="product-card">{content}</article>;
};

const HomePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="home-page-new">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <span className="hero-kicker">{t("homeNew.hero.kicker")}</span>
          <h1 id="home-title">{t("homeNew.hero.title")}</h1>
          <p>{t("homeNew.hero.body")}</p>
          <a className="primary-button" href="#apps">{t("homeNew.hero.cta")}</a>
        </div>
        <div className="hero-lab-mark" aria-hidden="true">
          <span className="hero-orbit hero-orbit-one" />
          <span className="hero-orbit hero-orbit-two" />
          <span className="hero-steam">MCL</span>
          <small>{t("homeNew.hero.mark")}</small>
        </div>
      </section>

      <section className="home-section" id="apps" aria-labelledby="apps-title">
        <div className="section-heading">
          <div><span className="section-kicker">{t("homeNew.apps.kicker")}</span><h2 id="apps-title">{t("homeNew.apps.title")}</h2></div>
          <p>{t("homeNew.apps.intro")}</p>
        </div>
        <div className="product-grid product-grid-featured">
          <ProductCard name="Kvittek" eyebrow={t("homeNew.status.available")} description={t("homeNew.apps.kvittek")} image="kvitteklogo.png" accent="#ff9a3d" href="/receipts" cta={t("homeNew.actions.readMore")} />
          <ProductCard name="husk'et" eyebrow={t("homeNew.status.available")} description={t("homeNew.apps.husket")} image="husketlogo.svg" accent="#ea386f" href="/husket" cta={t("homeNew.actions.readMore")} />
          <ProductCard name="Fury O" eyebrow={t("homeNew.status.available")} description={t("homeNew.apps.fury")} image="fury-logo.png" imageClassName="product-logo-contain" accent="#ff6b2d" />
          <ProductCard name="R4" eyebrow={t("homeNew.status.available")} description={t("homeNew.apps.r4")} image="r4-logo.png" imageClassName="product-logo-cover" accent="#a7e93d" />
        </div>
      </section>

      <section className="home-section lab-section" id="lab" aria-labelledby="lab-title">
        <div className="section-heading section-heading-light">
          <div><span className="section-kicker">{t("homeNew.now.kicker")}</span><h2 id="lab-title">{t("homeNew.now.title")}</h2></div>
          <p>{t("homeNew.now.intro")}</p>
        </div>
        <div className="current-grid">
          <article className="current-project current-project-mosaic">
            <div className="current-media"><img src={`${assetBase}mosaic_me_logo.png`} alt="Mosaic ME logo" /></div>
            <div className="current-copy"><span className="project-number">01</span><span className="section-kicker">{t("homeNew.now.priority")}</span><h3>Mosaic ME</h3><p>{t("homeNew.now.mosaic")}</p></div>
          </article>
          <article className="current-project current-project-bop">
            <div className="current-media bop-placeholder" aria-label={t("homeNew.now.bopAlt")}><span className="bop-ball" /><strong>BOP</strong><small>{t("homeNew.status.visualComing")}</small></div>
            <div className="current-copy"><span className="project-number">02</span><span className="section-kicker">{t("homeNew.now.priority")}</span><h3>{t("homeNew.now.bopTitle")}</h3><p>{t("homeNew.now.bop")}</p></div>
          </article>
        </div>
      </section>

      <section className="home-section pipeline-section" id="workshop" aria-labelledby="pipeline-title">
        <div className="section-heading">
          <div><span className="section-kicker">{t("homeNew.pipeline.kicker")}</span><h2 id="pipeline-title">{t("homeNew.pipeline.title")}</h2></div>
          <p>{t("homeNew.pipeline.intro")}</p>
        </div>
        <div className="pipeline-list">
          <article className="pipeline-item pipeline-taptoken"><span className="pipeline-index">01</span><div className="pipeline-icon" aria-hidden="true">T</div><div><h3>TapToken</h3><p>{t("homeNew.pipeline.taptoken")}</p></div><span className="pipeline-status">{t("homeNew.status.inDevelopment")}</span></article>
          <article className="pipeline-item pipeline-husket"><span className="pipeline-index">02</span><img src={`${assetBase}husketlogo.svg`} alt="" aria-hidden="true" /><div><h3>husk'et v2</h3><p>{t("homeNew.pipeline.husket")}</p></div><span className="pipeline-status">{t("homeNew.status.workingTitle")}</span></article>
          <article className="pipeline-item pipeline-ideas"><span className="pipeline-index">03</span><div className="pipeline-icon" aria-hidden="true">+</div><div><h3>{t("homeNew.pipeline.ideasTitle")}</h3><p>{t("homeNew.pipeline.ideas")}</p></div><Link className="pipeline-status pipeline-link" to="/idebank">{t("homeNew.actions.visit")}</Link></article>
        </div>
      </section>

      <section className="origin-note" aria-labelledby="origin-title">
        <div className="origin-icon" aria-hidden="true">⌁</div>
        <div><span className="section-kicker">{t("homeNew.origin.kicker")}</span><h2 id="origin-title">{t("homeNew.origin.title")}</h2><p>{t("homeNew.origin.body")}</p></div>
        <Link className="origin-link" to="/idebank">{t("homeNew.origin.cta")} <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
};

export default HomePage;
