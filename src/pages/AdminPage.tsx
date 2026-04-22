import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  PRODUCTS,
  type ProductContentBlock,
  type ProductDefinition,
  type ProductSlug,
} from "../config/products";
import {
  PRODUCT_OVERRIDES_STORAGE_KEY,
  getProductTextValue,
  readProductOverrides,
  resetProductOverrides,
  writeProductOverrides,
  type ProductOverrideMap,
} from "../config/productOverrides";
import {
  PAGE_OVERRIDES_STORAGE_KEY,
  getPageTextValue,
  readPageOverrides,
  resetPageOverrides,
  writePageOverrides,
  type EditablePageSlug,
  type PageOverrideMap,
} from "../config/pageOverrides";
import { EDITABLE_PAGES } from "../config/editablePages";

type DraftField = {
  visible: boolean;
  homeTitleNo: string;
  homeTitleEn: string;
  homeBodyNo: string;
  homeBodyEn: string;
  homeCtaNo: string;
  homeCtaEn: string;
  pageTextNo: Record<string, string>;
  pageTextEn: Record<string, string>;
};

type DraftMap = Record<ProductSlug, DraftField>;

type PageDraftField = {
  textNo: Record<string, string>;
  textEn: Record<string, string>;
};

type PageDraftMap = Record<EditablePageSlug, PageDraftField>;

type AdminTab = "products" | "pages";

function collectTextKeys(blocks: ProductContentBlock[]): string[] {
  const keys = new Set<string>();

  function add(key?: string) {
    if (key) keys.add(key);
  }

  for (const block of blocks) {
    switch (block.type) {
      case "hero":
        add(block.titleKey);
        add(block.taglineKey);
        block.bodyKeys?.forEach(add);
        add(block.cta?.labelKey);
        break;
      case "heroSplit":
        add(block.titleKey);
        add(block.taglineKey);
        block.bodyKeys?.forEach(add);
        add(block.image.altKey);
        add(block.cta?.labelKey);
        break;
      case "imageGrid":
        add(block.titleKey);
        block.items.forEach((item) => add(item.altKey));
        break;
      case "figureGrid":
        add(block.titleKey);
        block.items.forEach((item) => {
          add(item.altKey);
          add(item.captionKey);
        });
        break;
      case "bulletCard":
        block.bulletKeys.forEach(add);
        block.strongBodyKeys?.forEach(add);
        break;
      case "cardsGrid":
        block.items.forEach((item) => {
          add(item.titleKey);
          item.bodyKeys.forEach(add);
          add(item.cta?.labelKey);
        });
        break;
      case "flowColumns":
        block.columns.forEach((column) => {
          add(column.titleKey);
          column.blocks.forEach((subBlock) => {
            add(subBlock.titleKey);
            subBlock.bodyKeys.forEach(add);
          });
        });
        break;
      case "bottomCards":
        block.items.forEach((item) => {
          add(item.titleKey);
          item.bodyKeys.forEach(add);
        });
        break;
      case "cta":
        add(block.titleKey);
        add(block.subKey);
        add(block.button.labelKey);
        add(block.noteKey);
        break;
    }
  }

  return Array.from(keys);
}

function buildProductDrafts(
  overrides: ProductOverrideMap,
  tNo: (key: string) => string,
  tEn: (key: string) => string
): DraftMap {
  return PRODUCTS.reduce((acc, product) => {
    const override = overrides[product.slug];
    const pageTextKeys = collectTextKeys(product.blocks);
    const pageTextNo: Record<string, string> = {};
    const pageTextEn: Record<string, string> = {};

    pageTextKeys.forEach((textKey) => {
      pageTextNo[textKey] = getProductTextValue(product.slug, textKey, "no", tNo(textKey), overrides);
      pageTextEn[textKey] = getProductTextValue(product.slug, textKey, "en", tEn(textKey), overrides);
    });

    acc[product.slug] = {
      visible: override?.visible ?? true,
      homeTitleNo: override?.homeTitle?.no ?? tNo(product.home.titleKey),
      homeTitleEn: override?.homeTitle?.en ?? tEn(product.home.titleKey),
      homeBodyNo: override?.homeBody?.no ?? tNo(product.home.bodyKey),
      homeBodyEn: override?.homeBody?.en ?? tEn(product.home.bodyKey),
      homeCtaNo: override?.homeCta?.no ?? tNo(product.home.ctaKey),
      homeCtaEn: override?.homeCta?.en ?? tEn(product.home.ctaKey),
      pageTextNo,
      pageTextEn,
    };

    return acc;
  }, {} as DraftMap);
}

function buildPageDrafts(
  overrides: PageOverrideMap,
  tNo: (key: string) => string,
  tEn: (key: string) => string
): PageDraftMap {
  return EDITABLE_PAGES.reduce((acc, page) => {
    const textNo: Record<string, string> = {};
    const textEn: Record<string, string> = {};

    page.textKeys.forEach((textKey) => {
      textNo[textKey] = getPageTextValue(page.slug, textKey, "no", tNo(textKey), overrides);
      textEn[textKey] = getPageTextValue(page.slug, textKey, "en", tEn(textKey), overrides);
    });

    acc[page.slug] = { textNo, textEn };
    return acc;
  }, {} as PageDraftMap);
}

function prettifyKey(key: string): string {
  return key
    .split(".")
    .slice(-2)
    .join(" · ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const AdminPage: React.FC = () => {
  const [productDrafts, setProductDrafts] = useState<DraftMap | null>(null);
  const [pageDrafts, setPageDrafts] = useState<PageDraftMap | null>(null);
  const [savedAt, setSavedAt] = useState<string>("");
  const [expandedSlug, setExpandedSlug] = useState<ProductSlug | null>(null);
  const [expandedPageSlug, setExpandedPageSlug] = useState<EditablePageSlug | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { dictionaries, createT } = await import("../i18n");
      if (!mounted) return;

      const tNo = createT(dictionaries.no) as (key: string) => string;
      const tEn = createT(dictionaries.en) as (key: string) => string;

      setProductDrafts(buildProductDrafts(readProductOverrides(), tNo, tEn));
      setPageDrafts(buildPageDrafts(readPageOverrides(), tNo, tEn));
      setExpandedSlug(PRODUCTS[0]?.slug ?? null);
      setExpandedPageSlug(EDITABLE_PAGES[0]?.slug ?? null);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const productTextKeys = useMemo(() => {
    return PRODUCTS.reduce((acc, product) => {
      acc[product.slug] = collectTextKeys(product.blocks);
      return acc;
    }, {} as Record<ProductSlug, string[]>);
  }, []);

  function updateDraft(slug: ProductSlug, patch: Partial<DraftField>) {
    setProductDrafts((current) => {
      if (!current) return current;
      return { ...current, [slug]: { ...current[slug], ...patch } };
    });
  }

  function updateProductPageText(slug: ProductSlug, lang: "no" | "en", textKey: string, value: string) {
    setProductDrafts((current) => {
      if (!current) return current;
      return {
        ...current,
        [slug]: {
          ...current[slug],
          pageTextNo: lang === "no" ? { ...current[slug].pageTextNo, [textKey]: value } : current[slug].pageTextNo,
          pageTextEn: lang === "en" ? { ...current[slug].pageTextEn, [textKey]: value } : current[slug].pageTextEn,
        },
      };
    });
  }

  function updatePageText(pageSlug: EditablePageSlug, lang: "no" | "en", textKey: string, value: string) {
    setPageDrafts((current) => {
      if (!current) return current;
      return {
        ...current,
        [pageSlug]: {
          ...current[pageSlug],
          textNo: lang === "no" ? { ...current[pageSlug].textNo, [textKey]: value } : current[pageSlug].textNo,
          textEn: lang === "en" ? { ...current[pageSlug].textEn, [textKey]: value } : current[pageSlug].textEn,
        },
      };
    });
  }

  function handleSave() {
    if (!productDrafts || !pageDrafts) return;

    const productOverrides: ProductOverrideMap = PRODUCTS.reduce((acc, product) => {
      const draft = productDrafts[product.slug];
      const pageText: Record<string, { no: string; en: string }> = {};

      productTextKeys[product.slug].forEach((textKey) => {
        pageText[textKey] = {
          no: draft.pageTextNo[textKey] ?? "",
          en: draft.pageTextEn[textKey] ?? "",
        };
      });

      acc[product.slug] = {
        visible: draft.visible,
        homeTitle: { no: draft.homeTitleNo, en: draft.homeTitleEn },
        homeBody: { no: draft.homeBodyNo, en: draft.homeBodyEn },
        homeCta: { no: draft.homeCtaNo, en: draft.homeCtaEn },
        pageText,
      };

      return acc;
    }, {} as ProductOverrideMap);

    const pageOverrides: PageOverrideMap = EDITABLE_PAGES.reduce((acc, page) => {
      const draft = pageDrafts[page.slug];
      const textMap: Record<string, { no: string; en: string }> = {};
      page.textKeys.forEach((textKey) => {
        textMap[textKey] = {
          no: draft.textNo[textKey] ?? "",
          en: draft.textEn[textKey] ?? "",
        };
      });
      acc[page.slug] = textMap;
      return acc;
    }, {} as PageOverrideMap);

    writeProductOverrides(productOverrides);
    writePageOverrides(pageOverrides);
    setSavedAt(new Date().toLocaleString());
  }

  async function handleResetAll() {
    resetProductOverrides();
    resetPageOverrides();

    const { dictionaries, createT } = await import("../i18n");
    const tNo = createT(dictionaries.no) as (key: string) => string;
    const tEn = createT(dictionaries.en) as (key: string) => string;

    setProductDrafts(buildProductDrafts({}, tNo, tEn));
    setPageDrafts(buildPageDrafts({}, tNo, tEn));
    setSavedAt("");
  }

  if (!productDrafts || !pageDrafts) {
    return (
      <main className="page">
        <section className="fs-hero">
          <h1>Admin</h1>
          <p>Laster kontrollpanel…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="fs-hero" style={{ maxWidth: 1100 }}>
        <h1>MCL Admin</h1>
        <p className="fs-tagline" style={{ maxWidth: 900 }}>
          Nå styrer du produktfliser, produktsidetekst og utvalgte innholdssider fra samme kontrollpanel.
        </p>
        <p style={{ maxWidth: 900 }}>
          Dette lagres fortsatt lokalt i nettleseren. Vi bruker det bevisst for å spikre struktur og arbeidsflyt før vi kobler på Firebase og innlogging.
        </p>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button type="button" className="hero-cta" onClick={handleSave}>
            Lagre endringer
          </button>
          <button type="button" className="status-button" onClick={handleResetAll} style={{ cursor: "pointer" }}>
            Nullstill lokale endringer
          </button>
          <Link to="/" className="status-button" style={{ textDecoration: "none" }}>
            Se forsiden
          </Link>
        </div>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button
            type="button"
            className={activeTab === "products" ? "hero-cta" : "status-button"}
            onClick={() => setActiveTab("products")}
            style={{ cursor: "pointer" }}
          >
            Produkter
          </button>
          <button
            type="button"
            className={activeTab === "pages" ? "hero-cta" : "status-button"}
            onClick={() => setActiveTab("pages")}
            style={{ cursor: "pointer" }}
          >
            Innholdssider
          </button>
        </div>

        <p style={{ marginTop: "1rem", opacity: 0.8 }}>
          Produktnøkkel: <code>{PRODUCT_OVERRIDES_STORAGE_KEY}</code> · Sidenøkkel: <code>{PAGE_OVERRIDES_STORAGE_KEY}</code>
          {savedAt ? ` · sist lagret ${savedAt}` : ""}
        </p>
      </section>

      {activeTab === "products" ? (
        <section className="intro-grid" style={{ marginTop: "2rem" }}>
          {PRODUCTS.map((product: ProductDefinition) => {
            const draft = productDrafts[product.slug];
            const expanded = expandedSlug === product.slug;

            return (
              <div key={product.slug} className="intro-card" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: "0.35rem" }}>{product.slug}</h3>
                    <p style={{ margin: 0, opacity: 0.8 }}>
                      Rute: <code>{product.routePath}</code>
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={draft.visible}
                        onChange={(event) => updateDraft(product.slug, { visible: event.target.checked })}
                      />
                      Vis produkt på forsiden
                    </label>

                    <button
                      type="button"
                      className="status-button"
                      style={{ cursor: "pointer" }}
                      onClick={() => setExpandedSlug(expanded ? null : product.slug)}
                    >
                      {expanded ? "Skjul felter" : "Rediger produkt"}
                    </button>
                  </div>
                </div>

                {!expanded ? null : (
                  <div style={{ marginTop: "1.25rem", display: "grid", gap: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                      <div>
                        <h4 style={{ marginTop: 0 }}>Forsideflis · Norsk</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tittel</span>
                          <input value={draft.homeTitleNo} onChange={(event) => updateDraft(product.slug, { homeTitleNo: event.target.value })} style={{ width: "100%", padding: "0.7rem" }} />
                        </label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Brødtekst</span>
                          <textarea value={draft.homeBodyNo} onChange={(event) => updateDraft(product.slug, { homeBodyNo: event.target.value })} rows={5} style={{ width: "100%", padding: "0.7rem", resize: "vertical" }} />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span>
                          <input value={draft.homeCtaNo} onChange={(event) => updateDraft(product.slug, { homeCtaNo: event.target.value })} style={{ width: "100%", padding: "0.7rem" }} />
                        </label>
                      </div>

                      <div>
                        <h4 style={{ marginTop: 0 }}>Forsideflis · English</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Title</span>
                          <input value={draft.homeTitleEn} onChange={(event) => updateDraft(product.slug, { homeTitleEn: event.target.value })} style={{ width: "100%", padding: "0.7rem" }} />
                        </label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Body</span>
                          <textarea value={draft.homeBodyEn} onChange={(event) => updateDraft(product.slug, { homeBodyEn: event.target.value })} rows={5} style={{ width: "100%", padding: "0.7rem", resize: "vertical" }} />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span>
                          <input value={draft.homeCtaEn} onChange={(event) => updateDraft(product.slug, { homeCtaEn: event.target.value })} style={{ width: "100%", padding: "0.7rem" }} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Produktside · tekstfelter</h4>
                      <div style={{ display: "grid", gap: "1rem" }}>
                        {productTextKeys[product.slug].map((textKey) => (
                          <div key={textKey} style={{ border: "1px solid rgba(127,127,127,0.25)", borderRadius: "14px", padding: "1rem" }}>
                            <p style={{ marginTop: 0, marginBottom: "0.35rem", fontWeight: 700 }}>{prettifyKey(textKey)}</p>
                            <p style={{ marginTop: 0, marginBottom: "0.85rem", opacity: 0.65 }}><code>{textKey}</code></p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                              <label style={{ display: "block" }}>
                                <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Norsk</span>
                                <textarea value={draft.pageTextNo[textKey] ?? ""} onChange={(event) => updateProductPageText(product.slug, "no", textKey, event.target.value)} rows={3} style={{ width: "100%", padding: "0.7rem", resize: "vertical" }} />
                              </label>
                              <label style={{ display: "block" }}>
                                <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>English</span>
                                <textarea value={draft.pageTextEn[textKey] ?? ""} onChange={(event) => updateProductPageText(product.slug, "en", textKey, event.target.value)} rows={3} style={{ width: "100%", padding: "0.7rem", resize: "vertical" }} />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ) : (
        <section className="intro-grid" style={{ marginTop: "2rem" }}>
          {EDITABLE_PAGES.map((page) => {
            const draft = pageDrafts[page.slug];
            const expanded = expandedPageSlug === page.slug;

            return (
              <div key={page.slug} className="intro-card" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: "0.35rem" }}>{page.title}</h3>
                    <p style={{ margin: 0, opacity: 0.8 }}>Rute: <code>{page.routePath}</code></p>
                  </div>
                  <button type="button" className="status-button" style={{ cursor: "pointer" }} onClick={() => setExpandedPageSlug(expanded ? null : page.slug)}>
                    {expanded ? "Skjul felter" : "Rediger side"}
                  </button>
                </div>

                {!expanded ? null : (
                  <div style={{ marginTop: "1.25rem", display: "grid", gap: "1rem" }}>
                    {page.textKeys.map((textKey) => (
                      <div key={textKey} style={{ border: "1px solid rgba(127,127,127,0.25)", borderRadius: "14px", padding: "1rem" }}>
                        <p style={{ marginTop: 0, marginBottom: "0.35rem", fontWeight: 700 }}>{prettifyKey(textKey)}</p>
                        <p style={{ marginTop: 0, marginBottom: "0.85rem", opacity: 0.65 }}><code>{textKey}</code></p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                          <label style={{ display: "block" }}>
                            <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Norsk</span>
                            <textarea value={draft.textNo[textKey] ?? ""} onChange={(event) => updatePageText(page.slug, "no", textKey, event.target.value)} rows={3} style={{ width: "100%", padding: "0.7rem", resize: "vertical" }} />
                          </label>
                          <label style={{ display: "block" }}>
                            <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>English</span>
                            <textarea value={draft.textEn[textKey] ?? ""} onChange={(event) => updatePageText(page.slug, "en", textKey, event.target.value)} rows={3} style={{ width: "100%", padding: "0.7rem", resize: "vertical" }} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default AdminPage;
