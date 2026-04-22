import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS, type ProductContentBlock, type ProductSlug } from "../config/products";
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
import {
  CUSTOM_PRODUCTS_STORAGE_KEY,
  createEmptyCustomProduct,
  readCustomProducts,
  resetCustomProducts,
  writeCustomProducts,
  type CustomProduct,
} from "../config/customProducts";

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
type ProductView = "overview" | "builtin" | "custom";

function collectTextKeys(blocks: ProductContentBlock[]): string[] {
  const keys = new Set<string>();
  const add = (key?: string) => {
    if (key) keys.add(key);
  };

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

function makeUniqueSeed(customProducts: CustomProduct[]): number {
  let seed = customProducts.length + 1;
  const slugs = new Set([...PRODUCTS.map((p) => p.slug), ...customProducts.map((p) => p.slug)]);
  while (slugs.has(`new-product${seed > 1 ? `-${seed}` : ""}`)) seed += 1;
  return seed;
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function statusChip(status: "draft" | "published") {
  const isPublished = status === "published";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "0.2rem 0.55rem",
        borderRadius: 999,
        fontSize: "0.8rem",
        fontWeight: 700,
        background: isPublished ? "rgba(18, 183, 106, 0.12)" : "rgba(247, 144, 9, 0.14)",
        color: isPublished ? "#067647" : "#b54708",
      }}
    >
      {isPublished ? "Publisert" : "Kladd"}
    </span>
  );
}

const shellStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "300px minmax(0, 1fr)",
  gap: "1rem",
  alignItems: "start",
};

const panelStyle: React.CSSProperties = {
  border: "1px solid rgba(127,127,127,0.22)",
  borderRadius: 18,
  padding: "1rem",
  background: "rgba(255,255,255,0.04)",
};

const softPanelStyle: React.CSSProperties = {
  border: "1px solid rgba(127,127,127,0.16)",
  borderRadius: 14,
  padding: "0.9rem",
  background: "rgba(127,127,127,0.04)",
};

const inputStyle: React.CSSProperties = { width: "100%", padding: "0.7rem", borderRadius: 10, border: "1px solid rgba(127,127,127,0.28)" };
const textareaStyle: React.CSSProperties = { ...inputStyle, resize: "vertical", minHeight: 92 };
const sectionTitleStyle: React.CSSProperties = { marginTop: 0, marginBottom: "0.65rem" };

const AdminPage: React.FC = () => {
  const [productDrafts, setProductDrafts] = useState<DraftMap | null>(null);
  const [pageDrafts, setPageDrafts] = useState<PageDraftMap | null>(null);
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>([]);
  const [savedAt, setSavedAt] = useState<string>("");
  const [saveError, setSaveError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [productView, setProductView] = useState<ProductView>("overview");
  const [selectedBuiltInSlug, setSelectedBuiltInSlug] = useState<ProductSlug>(PRODUCTS[0]?.slug ?? "husket");
  const [selectedCustomKey, setSelectedCustomKey] = useState<string | null>(null);
  const [selectedPageSlug, setSelectedPageSlug] = useState<EditablePageSlug>(EDITABLE_PAGES[0]?.slug ?? "about");
  const [productSearch, setProductSearch] = useState("");
  const [pageSearch, setPageSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { dictionaries, createT } = await import("../i18n");
      if (!mounted) return;
      const tNo = createT(dictionaries.no) as (key: string) => string;
      const tEn = createT(dictionaries.en) as (key: string) => string;
      setProductDrafts(buildProductDrafts(readProductOverrides(), tNo, tEn));
      setPageDrafts(buildPageDrafts(readPageOverrides(), tNo, tEn));
      setCustomProducts(readCustomProducts());
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

  const stats = useMemo(() => {
    const publishedCustom = customProducts.filter((p) => p.status === "published").length;
    const visibleCustom = customProducts.filter((p) => p.visible).length;
    return {
      builtInProducts: PRODUCTS.length,
      customProducts: customProducts.length,
      publishedCustom,
      drafts: customProducts.length - publishedCustom,
      visibleCustom,
      editablePages: EDITABLE_PAGES.length,
    };
  }, [customProducts]);

  const filteredBuiltIn = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter((product) => {
      const draft = productDrafts?.[product.slug];
      const hay = [product.slug, draft?.homeTitleNo, draft?.homeTitleEn, draft?.homeBodyNo, draft?.homeBodyEn].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [productDrafts, productSearch]);

  const filteredCustom = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return customProducts;
    return customProducts.filter((product) => {
      const hay = [product.slug, product.routePath, product.homeTitle.no, product.homeTitle.en, product.pageTitle.no, product.pageTitle.en].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [customProducts, productSearch]);

  const filteredPages = useMemo(() => {
    const q = pageSearch.trim().toLowerCase();
    if (!q) return EDITABLE_PAGES;
    return EDITABLE_PAGES.filter((page) => `${page.title} ${page.slug} ${page.routePath}`.toLowerCase().includes(q));
  }, [pageSearch]);

  function updateDraft(slug: ProductSlug, patch: Partial<DraftField>) {
    setProductDrafts((current) => (current ? { ...current, [slug]: { ...current[slug], ...patch } } : current));
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

  function updateCustomProduct(index: number, patch: Partial<CustomProduct>) {
    setCustomProducts((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function updateCustomLocalizedField(
    index: number,
    field: keyof Pick<CustomProduct, "badge" | "homeTitle" | "homeBody" | "homeCta" | "pageTitle" | "pageTagline" | "pageIntro" | "finalTitle" | "finalBody" | "finalCta">,
    lang: "no" | "en",
    value: string
  ) {
    setCustomProducts((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const currentValue = item[field] ?? { no: "", en: "" };
        return { ...item, [field]: { ...currentValue, [lang]: value } };
      })
    );
  }

  function updateCustomFeature(index: number, featureIndex: number, field: "title" | "body", lang: "no" | "en", value: string) {
    setCustomProducts((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        return {
          ...item,
          featureCards: item.featureCards.map((feature, currentFeatureIndex) =>
            currentFeatureIndex !== featureIndex ? feature : { ...feature, [field]: { ...feature[field], [lang]: value } }
          ),
        };
      })
    );
  }

  function addCustomProduct() {
    setCustomProducts((current) => {
      const next = [...current, createEmptyCustomProduct(makeUniqueSeed(current))];
      setActiveTab("products");
      setProductView("custom");
      setSelectedCustomKey(`custom-${next.length - 1}`);
      return next;
    });
  }

  function removeCustomProduct(index: number) {
    setCustomProducts((current) => current.filter((_, itemIndex) => itemIndex !== index).map((product, itemIndex) => ({ ...product, order: itemIndex + 1 })));
    setSelectedCustomKey((current) => (current === `custom-${index}` ? null : current));
  }

  function moveCustomProduct(index: number, direction: -1 | 1) {
    setCustomProducts((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 }));
    });
    setSelectedCustomKey(`custom-${Math.max(0, index + direction)}`);
  }

  function validateCustomProducts(productsToValidate: CustomProduct[]): string | null {
    const baseSlugs = new Set<string>(PRODUCTS.map((product) => product.slug));
    const basePaths = new Set(PRODUCTS.map((product) => product.routePath));
    const slugSet = new Set<string>();
    const pathSet = new Set<string>();

    for (const product of productsToValidate) {
      const slug = product.slug.trim().toLowerCase();
      const path = product.routePath.trim();
      if (!slug) return "Alle egne produkter må ha en slug.";
      if (!/^[a-z0-9-]+$/.test(slug)) return `Slug \"${slug}\" kan bare bruke små bokstaver, tall og bindestrek.`;
      if (!path.startsWith("/")) return `Ruten for ${slug} må starte med /.`;
      if (baseSlugs.has(slug)) return `Slug \"${slug}\" brukes allerede av et eksisterende produkt.`;
      if (basePaths.has(path)) return `Ruten \"${path}\" brukes allerede av et eksisterende produkt.`;
      if (slugSet.has(slug)) return `Slug \"${slug}\" brukes mer enn én gang blant egne produkter.`;
      if (pathSet.has(path)) return `Ruten \"${path}\" brukes mer enn én gang blant egne produkter.`;
      slugSet.add(slug);
      pathSet.add(path);
    }
    return null;
  }

  function handleSave() {
    if (!productDrafts || !pageDrafts) return;
    const customValidationError = validateCustomProducts(customProducts);
    if (customValidationError) {
      setSaveError(customValidationError);
      return;
    }

    const productOverrides: ProductOverrideMap = PRODUCTS.reduce((acc, product) => {
      const draft = productDrafts[product.slug];
      const pageText: Record<string, { no: string; en: string }> = {};
      productTextKeys[product.slug].forEach((textKey) => {
        pageText[textKey] = { no: draft.pageTextNo[textKey] ?? "", en: draft.pageTextEn[textKey] ?? "" };
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
        textMap[textKey] = { no: draft.textNo[textKey] ?? "", en: draft.textEn[textKey] ?? "" };
      });
      acc[page.slug] = textMap;
      return acc;
    }, {} as PageOverrideMap);

    writeProductOverrides(productOverrides);
    writePageOverrides(pageOverrides);
    writeCustomProducts(
      customProducts.map((product, index) => ({
        ...product,
        slug: normalizeSlug(product.slug.trim()),
        routePath: product.routePath.trim().startsWith("/") ? product.routePath.trim() : `/${product.routePath.trim()}`,
        order: index + 1,
        imageUrl: product.imageUrl?.trim() || undefined,
      }))
    );
    setSaveError("");
    setSavedAt(new Date().toLocaleString());
  }

  async function handleResetAll() {
    resetProductOverrides();
    resetPageOverrides();
    resetCustomProducts();
    const { dictionaries, createT } = await import("../i18n");
    const tNo = createT(dictionaries.no) as (key: string) => string;
    const tEn = createT(dictionaries.en) as (key: string) => string;
    setProductDrafts(buildProductDrafts({}, tNo, tEn));
    setPageDrafts(buildPageDrafts({}, tNo, tEn));
    setCustomProducts([]);
    setSavedAt("");
    setSaveError("");
    setSelectedCustomKey(null);
    setSelectedBuiltInSlug(PRODUCTS[0]?.slug ?? "husket");
    setSelectedPageSlug(EDITABLE_PAGES[0]?.slug ?? "about");
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

  const selectedBuiltInDraft = productDrafts[selectedBuiltInSlug];
  const selectedPage = EDITABLE_PAGES.find((page) => page.slug === selectedPageSlug) ?? EDITABLE_PAGES[0];
  const selectedPageDraft = pageDrafts[selectedPage.slug];
  const selectedCustomIndex = selectedCustomKey ? Number(selectedCustomKey.replace("custom-", "")) : -1;
  const selectedCustom = selectedCustomIndex >= 0 ? customProducts[selectedCustomIndex] : undefined;

  return (
    <main className="page">
      <section className="fs-hero" style={{ maxWidth: 1120 }}>
        <h1>MCL Admin</h1>
        <p className="fs-tagline" style={{ maxWidth: 920 }}>
          Et roligere kontrollpanel for nettstedet: produkter, egne produkter og innholdssider samlet i én arbeidsflate.
        </p>

        <div className="intro-grid" style={{ marginTop: "1.25rem" }}>
          <div className="intro-card"><strong>{stats.builtInProducts}</strong><br />Standardprodukter</div>
          <div className="intro-card"><strong>{stats.customProducts}</strong><br />Egne produkter</div>
          <div className="intro-card"><strong>{stats.publishedCustom}</strong><br />Publiserte</div>
          <div className="intro-card"><strong>{stats.editablePages}</strong><br />Innholdssider</div>
        </div>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button type="button" className="hero-cta" onClick={handleSave}>Lagre endringer</button>
          <button type="button" className="status-button" onClick={handleResetAll} style={{ cursor: "pointer" }}>Nullstill lokale endringer</button>
          <Link to="/" className="status-button" style={{ textDecoration: "none" }}>Se forsiden</Link>
        </div>

        <p style={{ marginTop: "1rem", opacity: 0.78, fontSize: "0.95rem" }}>
          Produktnøkkel: <code>{PRODUCT_OVERRIDES_STORAGE_KEY}</code> · Egne produkter: <code>{CUSTOM_PRODUCTS_STORAGE_KEY}</code> · Sidenøkkel: <code>{PAGE_OVERRIDES_STORAGE_KEY}</code>
          {savedAt ? ` · sist lagret ${savedAt}` : ""}
        </p>
        {saveError ? <p style={{ color: "#b42318", fontWeight: 700, marginTop: "0.75rem" }}>{saveError}</p> : null}
      </section>

      <section style={{ ...shellStyle, marginTop: "1.5rem" }}>
        <aside style={{ ...panelStyle, position: "sticky", top: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <button type="button" className={activeTab === "products" ? "hero-cta" : "status-button"} onClick={() => setActiveTab("products")}>Produkter</button>
            <button type="button" className={activeTab === "pages" ? "hero-cta" : "status-button"} onClick={() => setActiveTab("pages")}>Innholdssider</button>
          </div>

          {activeTab === "products" ? (
            <>
              <div style={{ marginTop: "1rem" }}>
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Søk i produkter" style={inputStyle} />
              </div>

              <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
                <button type="button" className={productView === "overview" ? "hero-cta" : "status-button"} onClick={() => setProductView("overview")}>Oversikt</button>
                <button type="button" className={productView === "builtin" ? "hero-cta" : "status-button"} onClick={() => setProductView("builtin")}>Standardprodukter</button>
                <button type="button" className={productView === "custom" ? "hero-cta" : "status-button"} onClick={() => setProductView("custom")}>Egne produkter</button>
              </div>

              {productView === "builtin" ? (
                <div style={{ marginTop: "1rem", display: "grid", gap: "0.45rem" }}>
                  {filteredBuiltIn.map((product) => (
                    <button
                      key={product.slug}
                      type="button"
                      onClick={() => setSelectedBuiltInSlug(product.slug)}
                      style={{
                        textAlign: "left",
                        borderRadius: 12,
                        border: selectedBuiltInSlug === product.slug ? "1px solid rgba(63, 131, 248, 0.55)" : "1px solid rgba(127,127,127,0.18)",
                        padding: "0.75rem",
                        background: selectedBuiltInSlug === product.slug ? "rgba(63,131,248,0.08)" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{productDrafts[product.slug].homeTitleNo}</div>
                      <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>{product.routePath}</div>
                    </button>
                  ))}
                </div>
              ) : null}

              {productView === "custom" ? (
                <div style={{ marginTop: "1rem", display: "grid", gap: "0.45rem" }}>
                  <button type="button" className="hero-cta" onClick={addCustomProduct}>Legg til nytt produkt</button>
                  {filteredCustom.map((product) => {
                    const realIndex = customProducts.findIndex((p) => p.slug === product.slug && p.routePath === product.routePath);
                    const editorKey = `custom-${realIndex}`;
                    const active = selectedCustomKey === editorKey;
                    return (
                      <button
                        key={`${editorKey}-${product.slug}`}
                        type="button"
                        onClick={() => setSelectedCustomKey(editorKey)}
                        style={{
                          textAlign: "left",
                          borderRadius: 12,
                          border: active ? "1px solid rgba(63, 131, 248, 0.55)" : "1px solid rgba(127,127,127,0.18)",
                          padding: "0.75rem",
                          background: active ? "rgba(63,131,248,0.08)" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                          <div style={{ fontWeight: 700 }}>{product.homeTitle.no}</div>
                          {statusChip(product.status)}
                        </div>
                        <div style={{ opacity: 0.7, fontSize: "0.9rem", marginTop: 4 }}>{product.routePath}</div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div style={{ marginTop: "1rem" }}>
                <input value={pageSearch} onChange={(e) => setPageSearch(e.target.value)} placeholder="Søk i innholdssider" style={inputStyle} />
              </div>
              <div style={{ marginTop: "1rem", display: "grid", gap: "0.45rem" }}>
                {filteredPages.map((page) => {
                  const active = selectedPageSlug === page.slug;
                  return (
                    <button
                      key={page.slug}
                      type="button"
                      onClick={() => setSelectedPageSlug(page.slug)}
                      style={{
                        textAlign: "left",
                        borderRadius: 12,
                        border: active ? "1px solid rgba(63, 131, 248, 0.55)" : "1px solid rgba(127,127,127,0.18)",
                        padding: "0.75rem",
                        background: active ? "rgba(63,131,248,0.08)" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{page.title}</div>
                      <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>{page.routePath}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        <div style={{ display: "grid", gap: "1rem" }}>
          {activeTab === "products" && productView === "overview" ? (
            <div style={panelStyle}>
              <h2 style={sectionTitleStyle}>Produktoversikt</h2>
              <div className="intro-grid" style={{ marginTop: 0 }}>
                <div className="intro-card">
                  <h3 style={{ marginTop: 0 }}>Standardprodukter</h3>
                  <p>{stats.builtInProducts} produkter styres gjennom samme produktmodell og kan redigeres med overskrifter, flistekster og sideinnhold.</p>
                  <button type="button" className="status-button" onClick={() => setProductView("builtin")}>Åpne standardprodukter</button>
                </div>
                <div className="intro-card">
                  <h3 style={{ marginTop: 0 }}>Egne produkter</h3>
                  <p>{stats.customProducts} produkter opprettet fra admin. {stats.publishedCustom} er publisert og {stats.drafts} ligger som kladd.</p>
                  <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                    <button type="button" className="status-button" onClick={() => setProductView("custom")}>Åpne egne produkter</button>
                    <button type="button" className="hero-cta" onClick={addCustomProduct}>Legg til nytt produkt</button>
                  </div>
                </div>
                <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
                  <h3 style={{ marginTop: 0 }}>Neste naturlige arbeidsflyt</h3>
                  <p style={{ marginBottom: 0 }}>Jobb gjerne slik: opprett produkt → la det stå som kladd → fyll ut sideinnhold → legg inn bilde → sett til publisert → lagre → sjekk forside og produktside.</p>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "products" && productView === "builtin" ? (
            <div style={panelStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <h2 style={sectionTitleStyle}>Standardprodukt · {selectedBuiltInDraft.homeTitleNo}</h2>
                  <p style={{ margin: 0, opacity: 0.78 }}>{PRODUCTS.find((p) => p.slug === selectedBuiltInSlug)?.routePath}</p>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={selectedBuiltInDraft.visible} onChange={(e) => updateDraft(selectedBuiltInSlug, { visible: e.target.checked })} />
                  Vis på forsiden
                </label>
              </div>

              <div style={{ ...softPanelStyle, marginTop: "1rem" }}>
                <h3 style={sectionTitleStyle}>Forsideflis</h3>
                <div className="intro-grid two-columns">
                  <div>
                    <label>Norsk tittel</label>
                    <input style={inputStyle} value={selectedBuiltInDraft.homeTitleNo} onChange={(e) => updateDraft(selectedBuiltInSlug, { homeTitleNo: e.target.value })} />
                  </div>
                  <div>
                    <label>English title</label>
                    <input style={inputStyle} value={selectedBuiltInDraft.homeTitleEn} onChange={(e) => updateDraft(selectedBuiltInSlug, { homeTitleEn: e.target.value })} />
                  </div>
                  <div>
                    <label>Norsk tekst</label>
                    <textarea style={textareaStyle} value={selectedBuiltInDraft.homeBodyNo} onChange={(e) => updateDraft(selectedBuiltInSlug, { homeBodyNo: e.target.value })} />
                  </div>
                  <div>
                    <label>English text</label>
                    <textarea style={textareaStyle} value={selectedBuiltInDraft.homeBodyEn} onChange={(e) => updateDraft(selectedBuiltInSlug, { homeBodyEn: e.target.value })} />
                  </div>
                  <div>
                    <label>Norsk CTA</label>
                    <input style={inputStyle} value={selectedBuiltInDraft.homeCtaNo} onChange={(e) => updateDraft(selectedBuiltInSlug, { homeCtaNo: e.target.value })} />
                  </div>
                  <div>
                    <label>English CTA</label>
                    <input style={inputStyle} value={selectedBuiltInDraft.homeCtaEn} onChange={(e) => updateDraft(selectedBuiltInSlug, { homeCtaEn: e.target.value })} />
                  </div>
                </div>
              </div>

              <div style={{ ...softPanelStyle, marginTop: "1rem" }}>
                <h3 style={sectionTitleStyle}>Produktside · tekstfelter</h3>
                <div style={{ display: "grid", gap: "0.9rem" }}>
                  {productTextKeys[selectedBuiltInSlug].map((textKey) => (
                    <div key={textKey} style={{ borderTop: "1px solid rgba(127,127,127,0.14)", paddingTop: "0.9rem" }}>
                      <strong>{prettifyKey(textKey)}</strong>
                      <div className="intro-grid two-columns" style={{ marginTop: "0.55rem" }}>
                        <div>
                          <label>Norsk</label>
                          <textarea style={textareaStyle} value={selectedBuiltInDraft.pageTextNo[textKey] ?? ""} onChange={(e) => updateProductPageText(selectedBuiltInSlug, "no", textKey, e.target.value)} />
                        </div>
                        <div>
                          <label>English</label>
                          <textarea style={textareaStyle} value={selectedBuiltInDraft.pageTextEn[textKey] ?? ""} onChange={(e) => updateProductPageText(selectedBuiltInSlug, "en", textKey, e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "products" && productView === "custom" ? (
            selectedCustom ? (
              <div style={panelStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                  <div>
                    <h2 style={sectionTitleStyle}>Eget produkt · {selectedCustom.homeTitle.no}</h2>
                    <p style={{ margin: 0, opacity: 0.78 }}>{selectedCustom.routePath}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                    {statusChip(selectedCustom.status)}
                    <button type="button" className="status-button" onClick={() => moveCustomProduct(selectedCustomIndex, -1)} disabled={selectedCustomIndex <= 0}>Flytt opp</button>
                    <button type="button" className="status-button" onClick={() => moveCustomProduct(selectedCustomIndex, 1)} disabled={selectedCustomIndex >= customProducts.length - 1}>Flytt ned</button>
                    <button type="button" className="status-button" onClick={() => removeCustomProduct(selectedCustomIndex)}>Slett</button>
                  </div>
                </div>

                <div className="intro-grid two-columns" style={{ marginTop: "1rem" }}>
                  <div style={softPanelStyle}>
                    <h3 style={sectionTitleStyle}>Status og publisering</h3>
                    <label>Status</label>
                    <select style={inputStyle} value={selectedCustom.status} onChange={(e) => updateCustomProduct(selectedCustomIndex, { status: e.target.value as CustomProduct["status"] })}>
                      <option value="draft">Kladd</option>
                      <option value="published">Publisert</option>
                    </select>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "0.9rem" }}>
                      <input type="checkbox" checked={selectedCustom.visible} onChange={(e) => updateCustomProduct(selectedCustomIndex, { visible: e.target.checked })} />
                      Vis på forsiden når publisert
                    </label>
                    <div style={{ marginTop: "0.9rem", opacity: 0.78, fontSize: "0.92rem" }}>
                      Rekkefølge: {selectedCustom.order}
                    </div>
                  </div>

                  <div style={softPanelStyle}>
                    <h3 style={sectionTitleStyle}>Teknisk identitet</h3>
                    <label>Slug</label>
                    <input style={inputStyle} value={selectedCustom.slug} onChange={(e) => updateCustomProduct(selectedCustomIndex, { slug: normalizeSlug(e.target.value) })} />
                    <label style={{ marginTop: "0.8rem", display: "block" }}>Rute</label>
                    <input style={inputStyle} value={selectedCustom.routePath} onChange={(e) => updateCustomProduct(selectedCustomIndex, { routePath: e.target.value })} />
                    <label style={{ marginTop: "0.8rem", display: "block" }}>Bilde-URL</label>
                    <input style={inputStyle} value={selectedCustom.imageUrl ?? ""} onChange={(e) => updateCustomProduct(selectedCustomIndex, { imageUrl: e.target.value })} />
                  </div>
                </div>

                <div style={{ ...softPanelStyle, marginTop: "1rem" }}>
                  <h3 style={sectionTitleStyle}>Forsideflis</h3>
                  <div className="intro-grid two-columns">
                    <div>
                      <label>Badge · Norsk</label>
                      <input style={inputStyle} value={selectedCustom.badge?.no ?? ""} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "badge", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Badge · English</label>
                      <input style={inputStyle} value={selectedCustom.badge?.en ?? ""} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "badge", "en", e.target.value)} />
                    </div>
                    <div>
                      <label>Tittel · Norsk</label>
                      <input style={inputStyle} value={selectedCustom.homeTitle.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "homeTitle", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Title · English</label>
                      <input style={inputStyle} value={selectedCustom.homeTitle.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "homeTitle", "en", e.target.value)} />
                    </div>
                    <div>
                      <label>Tekst · Norsk</label>
                      <textarea style={textareaStyle} value={selectedCustom.homeBody.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "homeBody", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Text · English</label>
                      <textarea style={textareaStyle} value={selectedCustom.homeBody.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "homeBody", "en", e.target.value)} />
                    </div>
                    <div>
                      <label>CTA · Norsk</label>
                      <input style={inputStyle} value={selectedCustom.homeCta.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "homeCta", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>CTA · English</label>
                      <input style={inputStyle} value={selectedCustom.homeCta.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "homeCta", "en", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div style={{ ...softPanelStyle, marginTop: "1rem" }}>
                  <h3 style={sectionTitleStyle}>Produktside · hero og avslutning</h3>
                  <div className="intro-grid two-columns">
                    <div>
                      <label>Sideoverskrift · Norsk</label>
                      <input style={inputStyle} value={selectedCustom.pageTitle.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "pageTitle", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Page title · English</label>
                      <input style={inputStyle} value={selectedCustom.pageTitle.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "pageTitle", "en", e.target.value)} />
                    </div>
                    <div>
                      <label>Tagline · Norsk</label>
                      <textarea style={textareaStyle} value={selectedCustom.pageTagline.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "pageTagline", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Tagline · English</label>
                      <textarea style={textareaStyle} value={selectedCustom.pageTagline.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "pageTagline", "en", e.target.value)} />
                    </div>
                    <div>
                      <label>Intro · Norsk</label>
                      <textarea style={textareaStyle} value={selectedCustom.pageIntro.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "pageIntro", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Intro · English</label>
                      <textarea style={textareaStyle} value={selectedCustom.pageIntro.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "pageIntro", "en", e.target.value)} />
                    </div>
                    <div>
                      <label>Avslutning · tittel NO</label>
                      <input style={inputStyle} value={selectedCustom.finalTitle.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "finalTitle", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Closing title EN</label>
                      <input style={inputStyle} value={selectedCustom.finalTitle.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "finalTitle", "en", e.target.value)} />
                    </div>
                    <div>
                      <label>Avslutning · tekst NO</label>
                      <textarea style={textareaStyle} value={selectedCustom.finalBody.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "finalBody", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Closing text EN</label>
                      <textarea style={textareaStyle} value={selectedCustom.finalBody.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "finalBody", "en", e.target.value)} />
                    </div>
                    <div>
                      <label>Avsluttende CTA · NO</label>
                      <input style={inputStyle} value={selectedCustom.finalCta.no} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "finalCta", "no", e.target.value)} />
                    </div>
                    <div>
                      <label>Closing CTA · EN</label>
                      <input style={inputStyle} value={selectedCustom.finalCta.en} onChange={(e) => updateCustomLocalizedField(selectedCustomIndex, "finalCta", "en", e.target.value)} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label>Avsluttende CTA-lenke</label>
                      <input style={inputStyle} value={selectedCustom.finalCtaHref} onChange={(e) => updateCustomProduct(selectedCustomIndex, { finalCtaHref: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div style={{ ...softPanelStyle, marginTop: "1rem" }}>
                  <h3 style={sectionTitleStyle}>Fordelskort</h3>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {selectedCustom.featureCards.map((feature, featureIndex) => (
                      <div key={feature.id} style={{ borderTop: "1px solid rgba(127,127,127,0.14)", paddingTop: "0.9rem" }}>
                        <strong>Kort {featureIndex + 1}</strong>
                        <div className="intro-grid two-columns" style={{ marginTop: "0.55rem" }}>
                          <div>
                            <label>Tittel · Norsk</label>
                            <input style={inputStyle} value={feature.title.no} onChange={(e) => updateCustomFeature(selectedCustomIndex, featureIndex, "title", "no", e.target.value)} />
                          </div>
                          <div>
                            <label>Title · English</label>
                            <input style={inputStyle} value={feature.title.en} onChange={(e) => updateCustomFeature(selectedCustomIndex, featureIndex, "title", "en", e.target.value)} />
                          </div>
                          <div>
                            <label>Tekst · Norsk</label>
                            <textarea style={textareaStyle} value={feature.body.no} onChange={(e) => updateCustomFeature(selectedCustomIndex, featureIndex, "body", "no", e.target.value)} />
                          </div>
                          <div>
                            <label>Text · English</label>
                            <textarea style={textareaStyle} value={feature.body.en} onChange={(e) => updateCustomFeature(selectedCustomIndex, featureIndex, "body", "en", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={panelStyle}>
                <h2 style={sectionTitleStyle}>Egne produkter</h2>
                <p>Velg et produkt i venstremenyen, eller opprett et nytt.</p>
                <button type="button" className="hero-cta" onClick={addCustomProduct}>Legg til nytt produkt</button>
              </div>
            )
          ) : null}

          {activeTab === "pages" ? (
            <div style={panelStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <h2 style={sectionTitleStyle}>Innholdsside · {selectedPage.title}</h2>
                  <p style={{ margin: 0, opacity: 0.78 }}>{selectedPage.routePath}</p>
                </div>
              </div>
              <div style={{ ...softPanelStyle, marginTop: "1rem" }}>
                <h3 style={sectionTitleStyle}>Redigerbare tekstfelter</h3>
                <div style={{ display: "grid", gap: "0.9rem" }}>
                  {selectedPage.textKeys.map((textKey) => (
                    <div key={textKey} style={{ borderTop: "1px solid rgba(127,127,127,0.14)", paddingTop: "0.9rem" }}>
                      <strong>{prettifyKey(textKey)}</strong>
                      <div className="intro-grid two-columns" style={{ marginTop: "0.55rem" }}>
                        <div>
                          <label>Norsk</label>
                          <textarea style={textareaStyle} value={selectedPageDraft.textNo[textKey] ?? ""} onChange={(e) => updatePageText(selectedPage.slug, "no", textKey, e.target.value)} />
                        </div>
                        <div>
                          <label>English</label>
                          <textarea style={textareaStyle} value={selectedPageDraft.textEn[textKey] ?? ""} onChange={(e) => updatePageText(selectedPage.slug, "en", textKey, e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default AdminPage;
