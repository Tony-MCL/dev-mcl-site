import React, { useEffect } from "react";
import { useI18n } from "../i18n/useI18n";
import { getProductBySlug, type ProductContentBlock, type ProductSlug } from "../config/products";
import { getProductTextValue } from "../config/productOverrides";
import { getLocalizedValue, readCustomProducts, type CustomProduct } from "../config/customProducts";

const txt = (slug: ProductSlug, t: (key: string) => string, lang: "no" | "en", key: string) =>
  getProductTextValue(slug, key, lang, t(key));

const isBaseProductSlug = (value: string): value is ProductSlug => value === "husket" || value === "receipts";

type ProductPageProps = {
  slug: string;
};

function renderBlock(block: ProductContentBlock, slug: ProductSlug, t: (key: string) => string, lang: "no" | "en") {
  switch (block.type) {
    case "hero":
      return (
        <section key={block.id} className={block.className ?? "fs-hero"}>
          {block.titleKey ? <h1 className={block.titleClassName}>{txt(slug, t, lang, block.titleKey)}</h1> : null}
          {block.taglineKey ? <p className={block.taglineClassName}>{txt(slug, t, lang, block.taglineKey)}</p> : null}
          {block.bodyKeys?.map((bodyKey: string, index: number) => (
            <p key={bodyKey} className={index === block.bodyKeys!.length - 1 ? block.lastBodyClassName : undefined}>
              {txt(slug, t, lang, bodyKey)}
            </p>
          ))}
          {block.cta ? (
            <a href={block.cta.href} target={block.cta.external ? "_blank" : undefined} rel={block.cta.external ? "noopener noreferrer" : undefined} className={block.cta.className}>
              {txt(slug, t, lang, block.cta.labelKey)}
            </a>
          ) : null}
        </section>
      );

    case "heroSplit":
      return (
        <section key={block.id} className={block.className}>
          <div className={block.mediaWrapClassName} aria-hidden={block.mediaDecorative ? "true" : undefined}>
            <img
              src={`${import.meta.env.BASE_URL}${block.image.src}`}
              alt={block.image.altKey ? txt(slug, t, lang, block.image.altKey) : ""}
              className={block.image.className}
            />
          </div>
          <div className={block.copyClassName}>
            {block.titleKey ? <h1 className={block.titleClassName}>{txt(slug, t, lang, block.titleKey)}</h1> : null}
            {block.taglineKey ? <p className={block.taglineClassName}>{txt(slug, t, lang, block.taglineKey)}</p> : null}
            {block.bodyKeys?.map((bodyKey: string) => (
              <p key={bodyKey} className={block.bodyClassName}>
                {txt(slug, t, lang, bodyKey)}
              </p>
            ))}
            {block.cta ? (
              <a href={block.cta.href} target={block.cta.external ? "_blank" : undefined} rel={block.cta.external ? "noopener noreferrer" : undefined} className={block.cta.className}>
                {txt(slug, t, lang, block.cta.labelKey)}
              </a>
            ) : null}
          </div>
        </section>
      );

    case "imageGrid":
      return (
        <section key={block.id} className={block.className}>
          {block.titleKey ? <h3 style={{ marginTop: 0 }}>{txt(slug, t, lang, block.titleKey)}</h3> : null}
          <div className={block.className}>
            {block.items.map((item) => (
              <div key={item.src} className={item.cardClassName}>
                <img src={`${import.meta.env.BASE_URL}${item.src}`} alt={txt(slug, t, lang, item.altKey)} className={item.imageClassName} />
              </div>
            ))}
          </div>
        </section>
      );

    case "figureGrid":
      return (
        <section key={block.id} className={block.wrapperClassName}>
          {block.titleKey ? <h3 style={{ marginTop: 0 }}>{txt(slug, t, lang, block.titleKey)}</h3> : null}
          <div className={block.className}>
            {block.items.map((item) => (
              <figure key={item.src} className={item.figureClassName}>
                <img src={`${import.meta.env.BASE_URL}${item.src}`} alt={txt(slug, t, lang, item.altKey)} className={item.imageClassName} />
                <figcaption className={item.captionClassName}>{txt(slug, t, lang, item.captionKey)}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      );

    case "bulletCard":
      return (
        <section key={block.id} className={block.className ?? "intro-card"}>
          <ul>
            {block.bulletKeys.map((bulletKey: string) => (
              <li key={bulletKey}>{txt(slug, t, lang, bulletKey)}</li>
            ))}
          </ul>
          {block.strongBodyKeys?.map((bodyKey: string) => (
            <p key={bodyKey}><strong>{txt(slug, t, lang, bodyKey)}</strong></p>
          ))}
        </section>
      );

    case "cardsGrid":
      return (
        <section key={block.id} className={block.className}>
          {block.items.map((item) => (
            <div key={item.titleKey} className={item.cardClassName ?? "intro-card"} style={item.fullWidth ? { gridColumn: "1 / -1" } : undefined}>
              <h3 style={item.removeTopMargin ? { marginTop: 0 } : undefined}>{txt(slug, t, lang, item.titleKey)}</h3>
              {item.bodyKeys.map((bodyKey: string) => (
                <p key={bodyKey}>{txt(slug, t, lang, bodyKey)}</p>
              ))}
              {item.cta ? (
                <a href={item.cta.href} target={item.cta.external ? "_blank" : undefined} rel={item.cta.external ? "noopener noreferrer" : undefined} className={item.cta.className}>
                  {txt(slug, t, lang, item.cta.labelKey)}
                </a>
              ) : null}
            </div>
          ))}
        </section>
      );

    case "flowColumns":
      return (
        <section key={block.id} className={block.className}>
          {block.columns.map((column) => (
            <div key={column.titleKey} className="receipt-flow-column">
              <div className="intro-card receipt-flow-card">
                <h3 className="receipt-flow-main-title">{txt(slug, t, lang, column.titleKey)}</h3>
                {column.blocks.map((subBlock) => (
                  <div key={subBlock.titleKey} className="receipt-flow-block">
                    <h4 className="feature-sub">{txt(slug, t, lang, subBlock.titleKey)}</h4>
                    {subBlock.bodyKeys.map((bodyKey) => (
                      <p key={bodyKey}>{txt(slug, t, lang, bodyKey)}</p>
                    ))}
                  </div>
                ))}
              </div>
              <div className="receipt-flow-arrow" aria-hidden="true" />
            </div>
          ))}
        </section>
      );

    case "bottomCards":
      return (
        <section key={block.id} className={block.className}>
          {block.items.map((item) => (
            <div key={item.titleKey} className="intro-card receipt-flow-target">
              <h3>{txt(slug, t, lang, item.titleKey)}</h3>
              {item.bodyKeys.map((bodyKey) => (
                <p key={bodyKey}>{txt(slug, t, lang, bodyKey)}</p>
              ))}
            </div>
          ))}
        </section>
      );

    case "cta":
      return (
        <section key={block.id} className={block.className}>
          <div className={block.innerClassName}>
            <h2>{txt(slug, t, lang, block.titleKey)}</h2>
            <p className={block.subClassName}>{txt(slug, t, lang, block.subKey)}</p>
            <a href={block.button.href} target={block.button.external ? "_blank" : undefined} rel={block.button.external ? "noopener noreferrer" : undefined} className={block.button.className}>
              {txt(slug, t, lang, block.button.labelKey)}
            </a>
            <p className={block.noteClassName}>{txt(slug, t, lang, block.noteKey)}</p>
          </div>
        </section>
      );
  }
}

function renderCustomProduct(product: CustomProduct, lang: "no" | "en") {
  return (
    <main className="page">
      <section className="fs-hero" style={{ maxWidth: 980 }}>
        {product.status === "draft" ? (
          <p style={{ marginBottom: "0.75rem" }}>
            <span className="badge">Draft</span>
          </p>
        ) : null}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={getLocalizedValue(product.pageTitle, lang)}
            style={{ width: "100%", maxWidth: 980, aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 18, marginBottom: "1rem" }}
          />
        ) : null}
        <h1 className="hero-title">{getLocalizedValue(product.pageTitle, lang)}</h1>
        <p className="hero-tagline">{getLocalizedValue(product.pageTagline, lang)}</p>
        <p className="hero-sub" style={{ maxWidth: 820 }}>{getLocalizedValue(product.pageIntro, lang)}</p>
      </section>

      <section className="intro-grid two-columns">
        {product.featureCards.map((card) => (
          <div key={card.id} className="intro-card">
            <h3>{getLocalizedValue(card.title, lang)}</h3>
            <p>{getLocalizedValue(card.body, lang)}</p>
          </div>
        ))}

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{getLocalizedValue(product.finalTitle, lang)}</h3>
          <p>{getLocalizedValue(product.finalBody, lang)}</p>
          <a href={product.finalCtaHref} className="hero-cta">
            {getLocalizedValue(product.finalCta, lang)}
          </a>
        </div>
      </section>
    </main>
  );
}

const ProductPage: React.FC<ProductPageProps> = ({ slug }) => {
  const { t, lang } = useI18n();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  const baseProduct = isBaseProductSlug(slug) ? getProductBySlug(slug as any) : undefined;
  if (baseProduct) {
    return <main className={baseProduct.pageClassName}>{baseProduct.blocks.map((block) => renderBlock(block, slug, t, lang))}</main>;
  }

  const customProduct = readCustomProducts().find((item) => item.slug === slug);
  if (customProduct) return renderCustomProduct(customProduct, lang);

  return (
    <main className="page">
      <section className="fs-hero">
        <h1>Produkt ikke funnet</h1>
      </section>
    </main>
  );
};

export default ProductPage;
