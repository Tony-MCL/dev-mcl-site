import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const assetBase = import.meta.env.BASE_URL || "/";

function useMobileCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lane = ref.current;
    if (!lane) return;

    const mobileQuery = window.matchMedia("(max-width: 760px)");
    let startX = 0;
    let startIndex = 0;

    const getCards = () => Array.from(lane.children) as HTMLElement[];
    const getNearestIndex = (cards: HTMLElement[]) => {
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardPosition = card.offsetLeft - lane.offsetLeft;
        const distance = Math.abs(cardPosition - lane.scrollLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!mobileQuery.matches || event.touches.length !== 1) return;
      const cards = getCards();
      startX = event.touches[0].clientX;
      startIndex = getNearestIndex(cards);
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!mobileQuery.matches || event.changedTouches.length !== 1) return;
      const cards = getCards();
      if (!cards.length) return;

      const distance = startX - event.changedTouches[0].clientX;
      const direction = Math.abs(distance) < 32 ? 0 : distance > 0 ? 1 : -1;
      const targetIndex = direction === 0
        ? getNearestIndex(cards)
        : (startIndex + direction + cards.length) % cards.length;
      const wraps = direction !== 0 && Math.abs(targetIndex - startIndex) > 1;

      requestAnimationFrame(() => {
        lane.scrollTo({
          left: cards[targetIndex].offsetLeft - lane.offsetLeft,
          behavior: wraps ? "auto" : "smooth",
        });
      });
    };

    lane.addEventListener("touchstart", onTouchStart, { passive: true });
    lane.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      lane.removeEventListener("touchstart", onTouchStart);
      lane.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return ref;
}

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
  const appsCarouselRef = useMobileCarousel();
  const currentCarouselRef = useMobileCarousel();
  const pipelineCarouselRef = useMobileCarousel();

  return (
    <main className="home-page-new">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <span className="hero-kicker">{t("homeNew.hero.kicker")}</span>
          <h1 id="home-title">{t("homeNew.hero.title")}</h1>
          <p>{t("homeNew.hero.body")}</p>
          <a className="primary-button" href="#apps">{t("homeNew.hero.cta")}</a>
        </div>
        <div className="hero-cup-art" aria-hidden="true">
          <img src={`${assetBase}mcl-cup-paint.png`} alt="" />
        </div>
      </section>

      <section className="home-section" id="apps" aria-labelledby="apps-title">
        <div className="section-heading">
          <div><span className="section-kicker">{t("homeNew.apps.kicker")}</span><h2 id="apps-title">{t("homeNew.apps.title")}</h2></div>
          <p>{t("homeNew.apps.intro")}</p>
        </div>
        <div ref={appsCarouselRef} className="product-grid product-grid-featured">
          <ProductCard name="Kvittek" eyebrow={t("homeNew.status.available")} description={t("homeNew.apps.kvittek")} image="kvitteklogo.png" accent="#ff9a3d" href="/receipts" cta={t("homeNew.actions.readMore")} />
          <ProductCard name="FindBack" eyebrow={t("homeNew.status.availableBoth")} description={t("homeNew.apps.findback")} image="findback-icon.png" imageClassName="product-logo-app-icon" accent="#087cf0" href="/findback" cta={t("homeNew.actions.readMore")} />
          <ProductCard name="husk'et" eyebrow={t("homeNew.status.available")} description={t("homeNew.apps.husket")} image="husketlogo.svg" accent="#ea386f" href="/husket" cta={t("homeNew.actions.readMore")} />
          <ProductCard name="Fury O" eyebrow={t("homeNew.status.available")} description={t("homeNew.apps.fury")} image="fury-logo.png" imageClassName="product-logo-contain" accent="#ff6b2d" href="/fury-o" cta={t("homeNew.actions.readMore")} />
          <ProductCard name="R4" eyebrow={t("homeNew.status.available")} description={t("homeNew.apps.r4")} image="r4-logo.png" imageClassName="product-logo-cover" accent="#a7e93d" href="/r4" cta={t("homeNew.actions.readMore")} />
        </div>
      </section>

      <section className="home-section lab-section" id="lab" aria-labelledby="lab-title">
        <div className="section-heading section-heading-light">
          <div><span className="section-kicker">{t("homeNew.now.kicker")}</span><h2 id="lab-title">{t("homeNew.now.title")}</h2></div>
          <p>{t("homeNew.now.intro")}</p>
        </div>
        <div ref={currentCarouselRef} className="current-grid">
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
        <div ref={pipelineCarouselRef} className="pipeline-list">
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
