import React, { useEffect } from "react";
import { useI18n } from "../i18n/useI18n";
import { products } from "../config/products";
import { getProductBySlug, type ProductContentBlock, type ProductSlug } from "../content/products";

type ProductPageProps = {
  slug: ProductSlug;
};

function renderBlock(block: ProductContentBlock, t: <T = unknown>(key: string) => T) {
  switch (block.type) {
    case "hero":
      return (
        <section key={block.id} className={block.className ?? "fs-hero"}>
          {block.titleKey ? <h1 className={block.titleClassName}>{t(block.titleKey)}</h1> : null}
          {block.taglineKey ? <p className={block.taglineClassName ?? "fs-tagline"}>{t(block.taglineKey)}</p> : null}
          {block.bodyKeys?.map((bodyKey, index) => (
            <p key={bodyKey} className={index === block.bodyKeys.length - 1 ? block.lastBodyClassName : undefined}>
              {t(bodyKey)}
            </p>
          ))}

          {block.cta ? (
            <a
              href={block.cta.href}
              target={block.cta.external ? "_blank" : undefined}
              rel={block.cta.external ? "noopener noreferrer" : undefined}
              className={block.cta.className ?? "hero-cta"}
            >
              {t(block.cta.labelKey)}
            </a>
          ) : null}
        </section>
      );

    case "heroSplit":
      return (
        <section key={block.id} className={block.className}>
          <div className={block.mediaWrapClassName} aria-hidden={block.mediaDecorative ?? true}>
            <img
              src={`${import.meta.env.BASE_URL}${block.image.src}`}
              alt={block.mediaDecorative ? "" : String(t(block.image.altKey ?? ""))}
              className={block.image.className}
            />
          </div>

          <div className={block.copyClassName}>
            {block.titleKey ? <h1 className={block.titleClassName}>{t(block.titleKey)}</h1> : null}
            {block.taglineKey ? <p className={block.taglineClassName}>{t(block.taglineKey)}</p> : null}
            {block.bodyKeys?.map((bodyKey) => (
              <p key={bodyKey} className={block.bodyClassName}>
                {t(bodyKey)}
              </p>
            ))}

            {block.cta ? (
              <a
                href={block.cta.href}
                target={block.cta.external ? "_blank" : undefined}
                rel={block.cta.external ? "noopener noreferrer" : undefined}
                className={block.cta.className ?? "hero-cta"}
              >
                {t(block.cta.labelKey)}
              </a>
            ) : null}
          </div>
        </section>
      );

    case "imageGrid":
      return (
        <section key={block.id} className={block.className}>
          {block.titleKey ? (
            <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
              <h3 style={{ marginTop: 0 }}>{t(block.titleKey)}</h3>
            </div>
          ) : null}

          {block.items.map((item) => (
            <div key={item.src} className={item.cardClassName}>
              <img
                src={`${import.meta.env.BASE_URL}${item.src}`}
                alt={String(t(item.altKey))}
                className={item.imageClassName}
              />
            </div>
          ))}
        </section>
      );

    case "figureGrid":
      return (
        <section key={block.id} className={block.wrapperClassName ?? "intro-card"}>
          {block.titleKey ? <h3 style={{ marginTop: 0 }}>{t(block.titleKey)}</h3> : null}

          <div className={block.className}>
            {block.items.map((item) => (
              <figure key={item.src} className={item.figureClassName}>
                <img
                  src={`${import.meta.env.BASE_URL}${item.src}`}
                  alt={String(t(item.altKey))}
                  className={item.imageClassName}
                />
                <figcaption className={item.captionClassName}>{t(item.captionKey)}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      );

    case "bulletCard":
      return (
        <section key={block.id} className={block.className ?? "intro-card"}>
          <ul>
            {block.bulletKeys.map((bulletKey) => (
              <li key={bulletKey}>{t(bulletKey)}</li>
            ))}
          </ul>

          {block.strongBodyKeys?.map((bodyKey) => (
            <p key={bodyKey}>
              <strong>{t(bodyKey)}</strong>
            </p>
          ))}
        </section>
      );

    case "cardsGrid":
      return (
        <section key={block.id} className={block.className}>
          {block.items.map((item) => (
            <div key={item.titleKey} className={item.cardClassName ?? "intro-card"} style={item.fullWidth ? { gridColumn: "1 / -1" } : undefined}>
              <h3 style={item.removeTopMargin ? { marginTop: 0 } : undefined}>{t(item.titleKey)}</h3>
              {item.bodyKeys.map((bodyKey) => (
                <p key={bodyKey}>{t(bodyKey)}</p>
              ))}

              {item.cta ? (
                <a
                  href={item.cta.href}
                  target={item.cta.external ? "_blank" : undefined}
                  rel={item.cta.external ? "noopener noreferrer" : undefined}
                  className={item.cta.className ?? "hero-cta"}
                >
                  {t(item.cta.labelKey)}
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
                <h3 className="receipt-flow-main-title">{t(column.titleKey)}</h3>

                {column.blocks.map((subBlock) => (
                  <div key={subBlock.titleKey} className="receipt-flow-block">
                    <h4 className="feature-sub">{t(subBlock.titleKey)}</h4>
                    {subBlock.bodyKeys.map((bodyKey) => (
                      <p key={bodyKey}>{t(bodyKey)}</p>
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
              <h3>{t(item.titleKey)}</h3>
              {item.bodyKeys.map((bodyKey) => (
                <p key={bodyKey}>{t(bodyKey)}</p>
              ))}
            </div>
          ))}
        </section>
      );

    case "cta":
      return (
        <section key={block.id} className={block.className}>
          <div className={block.innerClassName}>
            <h2>{t(block.titleKey)}</h2>
            <p className={block.subClassName}>{t(block.subKey)}</p>

            <a
              href={block.button.href}
              target={block.button.external ? "_blank" : undefined}
              rel={block.button.external ? "noopener noreferrer" : undefined}
              className={block.button.className ?? "hero-cta"}
            >
              {t(block.button.labelKey)}
            </a>

            <p className={block.noteClassName}>{t(block.noteKey)}</p>
          </div>
        </section>
      );

    default:
      return null;
  }
}

const ProductPage: React.FC<ProductPageProps> = ({ slug }) => {
  const { t } = useI18n();
  const product = getProductBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  if (!product) return null;

  return (
    <main className={product.pageClassName}>
      {product.blocks.map((block) => renderBlock(block, t))}
    </main>
  );
};

export default ProductPage;
