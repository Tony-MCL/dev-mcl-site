import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS, type ProductContentBlock, type ProductDefinition } from "../config/products";
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

type DraftMap = Record<string, DraftField>;

type PageDraftField = {
  textNo: Record<string, string>;
  textEn: Record<string, string>;
};

type PageDraftMap = Record<EditablePageSlug, PageDraftField>;
type AdminTab = "products" | "pages";

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

const inputStyle: React.CSSProperties = { width: "100%", padding: "0.7rem" };
const textareaStyle: React.CSSProperties = { width: "100%", padding: "0.7rem", resize: "vertical" };
const cardStyle: React.CSSProperties = { border: "1px solid rgba(127,127,127,0.22)", borderRadius: 16, padding: "1rem" };

const AdminPage: React.FC = () => {
  const [productDrafts, setProductDrafts] = useState<DraftMap | null>(null);
  const [pageDrafts, setPageDrafts] = useState<PageDraftMap | null>(null);
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>([]);
  const [savedAt, setSavedAt] = useState<string>("");
  const [saveError, setSaveError] = useState<string>("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
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
      setCustomProducts(readCustomProducts());
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
    }, {} as Record<string, string[]>);
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

  function updateDraft(slug: string, patch: Partial<DraftField>) {
    setProductDrafts((current) => (current ? { ...current, [slug]: { ...current[slug], ...patch } } : current));
  }

  function updateProductPageText(slug: string, lang: "no" | "en", textKey: string, value: string) {
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
    setCustomProducts((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      const currentValue = item[field] ?? { no: "", en: "" };
      return { ...item, [field]: { ...currentValue, [lang]: value } };
    }));
  }

  function updateCustomFeature(index: number, featureIndex: number, field: "title" | "body", lang: "no" | "en", value: string) {
    setCustomProducts((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      return {
        ...item,
        featureCards: item.featureCards.map((feature, currentFeatureIndex) => (
          currentFeatureIndex !== featureIndex ? feature : { ...feature, [field]: { ...feature[field], [lang]: value } }
        )),
      };
    }));
  }

  function addCustomProduct() {
    setCustomProducts((current) => {
      const next = [...current, createEmptyCustomProduct(makeUniqueSeed(current))];
      setExpandedSlug(`custom-${next.length - 1}`);
      return next;
    });
  }

  function removeCustomProduct(index: number) {
    setCustomProducts((current) => current.filter((_, itemIndex) => itemIndex !== index).map((product, itemIndex) => ({ ...product, order: itemIndex + 1 })));
    setExpandedSlug((current) => (current === `custom-${index}` ? null : current));
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
  }

  function normalizeSlug(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-|-$/g, "");
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
    writeCustomProducts(customProducts.map((product, index) => ({
      ...product,
      slug: normalizeSlug(product.slug.trim()),
      routePath: product.routePath.trim().startsWith("/") ? product.routePath.trim() : `/${product.routePath.trim()}`,
      order: index + 1,
      imageUrl: product.imageUrl?.trim() || undefined,
    })));
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
  }

  if (!productDrafts || !pageDrafts) {
    return <main className="page"><section className="fs-hero"><h1>Admin</h1><p>Laster kontrollpanel…</p></section></main>;
  }

  return (
    <main className="page">
      <section className="fs-hero" style={{ maxWidth: 1120 }}>
        <h1>MCL Admin</h1>
        <p className="fs-tagline" style={{ maxWidth: 900 }}>
          Kontrollpanel for produkter, produktsider og innholdssider. Denne versjonen gir deg status, rekkefølge, bilder og en ryddigere produktflyt.
        </p>
        <div className="intro-grid" style={{ marginTop: "1.25rem" }}>
          <div className="intro-card"><strong>{stats.builtInProducts}</strong><br />Innebygde produkter</div>
          <div className="intro-card"><strong>{stats.customProducts}</strong><br />Egne produkter</div>
          <div className="intro-card"><strong>{stats.publishedCustom}</strong><br />Publiserte egne produkter</div>
          <div className="intro-card"><strong>{stats.drafts}</strong><br />Kladder</div>
        </div>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button type="button" className="hero-cta" onClick={handleSave}>Lagre endringer</button>
          <button type="button" className="status-button" onClick={handleResetAll} style={{ cursor: "pointer" }}>Nullstill lokale endringer</button>
          <Link to="/" className="status-button" style={{ textDecoration: "none" }}>Se forsiden</Link>
        </div>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button type="button" className={activeTab === "products" ? "hero-cta" : "status-button"} onClick={() => setActiveTab("products")}>Produkter</button>
          <button type="button" className={activeTab === "pages" ? "hero-cta" : "status-button"} onClick={() => setActiveTab("pages")}>Innholdssider</button>
        </div>

        <p style={{ marginTop: "1rem", opacity: 0.8 }}>
          Produktnøkkel: <code>{PRODUCT_OVERRIDES_STORAGE_KEY}</code> · Egenprodukter: <code>{CUSTOM_PRODUCTS_STORAGE_KEY}</code> · Sidenøkkel: <code>{PAGE_OVERRIDES_STORAGE_KEY}</code>
          {savedAt ? ` · sist lagret ${savedAt}` : ""}
        </p>
        {saveError ? <p style={{ color: "#b42318", fontWeight: 700, marginTop: "0.75rem" }}>{saveError}</p> : null}
      </section>

      {activeTab === "products" ? (
        <section className="intro-grid" style={{ marginTop: "2rem" }}>
          <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <h3 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Egne produkter</h3>
                <p style={{ margin: 0, opacity: 0.8 }}>Opprett kladder, legg på bilde, bestem rekkefølge og publiser når siden er klar.</p>
              </div>
              <button type="button" className="hero-cta" onClick={addCustomProduct}>Legg til nytt produkt</button>
            </div>
          </div>

          {customProducts.map((product, index) => {
            const editorKey = `custom-${index}`;
            const expanded = expandedSlug === editorKey;
            const homeLive = product.status === "published" && product.visible;
            return (
              <div key={editorKey} className="intro-card" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "1rem", alignItems: "start" }}>
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.35rem" }}>
                      <h3 style={{ margin: 0 }}>{product.homeTitle.no || product.slug}</h3>
                      <span className="badge">{product.status === "published" ? "Publisert" : "Kladd"}</span>
                      {homeLive ? <span className="badge">Vises på forsiden</span> : null}
                    </div>
                    <p style={{ margin: 0, opacity: 0.8 }}>Slug: <code>{product.slug}</code> · Rute: <code>{product.routePath}</code> · Sortering: <strong>{product.order}</strong></p>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <button type="button" className="status-button" onClick={() => moveCustomProduct(index, -1)} disabled={index === 0}>↑</button>
                    <button type="button" className="status-button" onClick={() => moveCustomProduct(index, 1)} disabled={index === customProducts.length - 1}>↓</button>
                    <button type="button" className="status-button" onClick={() => setExpandedSlug(expanded ? null : editorKey)}>{expanded ? "Skjul" : "Rediger"}</button>
                    <button type="button" className="status-button" onClick={() => removeCustomProduct(index)}>Slett</button>
                  </div>
                </div>

                {!expanded ? null : (
                  <div style={{ marginTop: "1.25rem", display: "grid", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                      <div style={cardStyle}>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Status</span>
                          <select value={product.status} onChange={(e) => updateCustomProduct(index, { status: e.target.value as CustomProduct["status"] })} style={inputStyle}>
                            <option value="draft">Kladd</option>
                            <option value="published">Publisert</option>
                          </select>
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontWeight: 600 }}>
                          <input type="checkbox" checked={product.visible} onChange={(e) => updateCustomProduct(index, { visible: e.target.checked })} />
                          Vis på forsiden når publisert
                        </label>
                      </div>

                      <div style={cardStyle}>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Slug</span>
                          <input value={product.slug} onChange={(e) => updateCustomProduct(index, { slug: e.target.value })} style={inputStyle} />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Rute</span>
                          <input value={product.routePath} onChange={(e) => updateCustomProduct(index, { routePath: e.target.value })} style={inputStyle} />
                        </label>
                      </div>

                      <div style={cardStyle}>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}>
                          <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Bilde-URL</span>
                          <input value={product.imageUrl ?? ""} onChange={(e) => updateCustomProduct(index, { imageUrl: e.target.value })} style={inputStyle} placeholder="https://..." />
                        </label>
                        {product.imageUrl ? <img src={product.imageUrl} alt="Preview" style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 12 }} /> : <p style={{ margin: 0, opacity: 0.65 }}>Ingen forhåndsvisning ennå.</p>}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                      <div style={cardStyle}>
                        <h4 style={{ marginTop: 0 }}>Forside · Norsk</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Badge</span><input value={product.badge?.no ?? ""} onChange={(e) => updateCustomLocalizedField(index, "badge", "no", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tittel</span><input value={product.homeTitle.no} onChange={(e) => updateCustomLocalizedField(index, "homeTitle", "no", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Brødtekst</span><textarea value={product.homeBody.no} onChange={(e) => updateCustomLocalizedField(index, "homeBody", "no", e.target.value)} rows={4} style={textareaStyle} /></label>
                        <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span><input value={product.homeCta.no} onChange={(e) => updateCustomLocalizedField(index, "homeCta", "no", e.target.value)} style={inputStyle} /></label>
                      </div>

                      <div style={cardStyle}>
                        <h4 style={{ marginTop: 0 }}>Forside · English</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Badge</span><input value={product.badge?.en ?? ""} onChange={(e) => updateCustomLocalizedField(index, "badge", "en", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Title</span><input value={product.homeTitle.en} onChange={(e) => updateCustomLocalizedField(index, "homeTitle", "en", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Body</span><textarea value={product.homeBody.en} onChange={(e) => updateCustomLocalizedField(index, "homeBody", "en", e.target.value)} rows={4} style={textareaStyle} /></label>
                        <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span><input value={product.homeCta.en} onChange={(e) => updateCustomLocalizedField(index, "homeCta", "en", e.target.value)} style={inputStyle} /></label>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                      <div style={cardStyle}>
                        <h4 style={{ marginTop: 0 }}>Produktside · Norsk</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tittel</span><input value={product.pageTitle.no} onChange={(e) => updateCustomLocalizedField(index, "pageTitle", "no", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tagline</span><input value={product.pageTagline.no} onChange={(e) => updateCustomLocalizedField(index, "pageTagline", "no", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Intro</span><textarea value={product.pageIntro.no} onChange={(e) => updateCustomLocalizedField(index, "pageIntro", "no", e.target.value)} rows={4} style={textareaStyle} /></label>
                      </div>

                      <div style={cardStyle}>
                        <h4 style={{ marginTop: 0 }}>Produktside · English</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Title</span><input value={product.pageTitle.en} onChange={(e) => updateCustomLocalizedField(index, "pageTitle", "en", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tagline</span><input value={product.pageTagline.en} onChange={(e) => updateCustomLocalizedField(index, "pageTagline", "en", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Intro</span><textarea value={product.pageIntro.en} onChange={(e) => updateCustomLocalizedField(index, "pageIntro", "en", e.target.value)} rows={4} style={textareaStyle} /></label>
                      </div>
                    </div>

                    <div style={cardStyle}>
                      <h4 style={{ marginTop: 0 }}>Fordelskort</h4>
                      <div style={{ display: "grid", gap: "1rem" }}>
                        {product.featureCards.map((feature, featureIndex) => (
                          <div key={feature.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", paddingTop: featureIndex === 0 ? 0 : "1rem", borderTop: featureIndex === 0 ? "none" : "1px solid rgba(127,127,127,0.2)" }}>
                            <div>
                              <p style={{ marginTop: 0, fontWeight: 700 }}>Kort {featureIndex + 1} · Norsk</p>
                              <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tittel</span><input value={feature.title.no} onChange={(e) => updateCustomFeature(index, featureIndex, "title", "no", e.target.value)} style={inputStyle} /></label>
                              <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tekst</span><textarea value={feature.body.no} onChange={(e) => updateCustomFeature(index, featureIndex, "body", "no", e.target.value)} rows={3} style={textareaStyle} /></label>
                            </div>
                            <div>
                              <p style={{ marginTop: 0, fontWeight: 700 }}>Card {featureIndex + 1} · English</p>
                              <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Title</span><input value={feature.title.en} onChange={(e) => updateCustomFeature(index, featureIndex, "title", "en", e.target.value)} style={inputStyle} /></label>
                              <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Text</span><textarea value={feature.body.en} onChange={(e) => updateCustomFeature(index, featureIndex, "body", "en", e.target.value)} rows={3} style={textareaStyle} /></label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                      <div style={cardStyle}>
                        <h4 style={{ marginTop: 0 }}>Avslutning · Norsk</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tittel</span><input value={product.finalTitle.no} onChange={(e) => updateCustomLocalizedField(index, "finalTitle", "no", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tekst</span><textarea value={product.finalBody.no} onChange={(e) => updateCustomLocalizedField(index, "finalBody", "no", e.target.value)} rows={3} style={textareaStyle} /></label>
                        <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span><input value={product.finalCta.no} onChange={(e) => updateCustomLocalizedField(index, "finalCta", "no", e.target.value)} style={inputStyle} /></label>
                      </div>

                      <div style={cardStyle}>
                        <h4 style={{ marginTop: 0 }}>Ending · English</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Title</span><input value={product.finalTitle.en} onChange={(e) => updateCustomLocalizedField(index, "finalTitle", "en", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Text</span><textarea value={product.finalBody.en} onChange={(e) => updateCustomLocalizedField(index, "finalBody", "en", e.target.value)} rows={3} style={textareaStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span><input value={product.finalCta.en} onChange={(e) => updateCustomLocalizedField(index, "finalCta", "en", e.target.value)} style={inputStyle} /></label>
                        <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA-lenke</span><input value={product.finalCtaHref} onChange={(e) => updateCustomProduct(index, { finalCtaHref: e.target.value })} style={inputStyle} /></label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {PRODUCTS.map((product: ProductDefinition) => {
            const draft = productDrafts[product.slug];
            const expanded = expandedSlug === product.slug;
            return (
              <div key={product.slug} className="intro-card" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: "0.35rem" }}>{product.slug}</h3>
                    <p style={{ margin: 0, opacity: 0.8 }}>Innebygd produkt · rute: <code>{product.routePath}</code></p>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontWeight: 600 }}>
                      <input type="checkbox" checked={draft.visible} onChange={(event) => updateDraft(product.slug, { visible: event.target.checked })} />
                      Vis produkt på forsiden
                    </label>
                    <button type="button" className="status-button" onClick={() => setExpandedSlug(expanded ? null : product.slug)}>
                      {expanded ? "Skjul felter" : "Rediger produkt"}
                    </button>
                  </div>
                </div>
                {!expanded ? null : (
                  <div style={{ marginTop: "1.25rem", display: "grid", gap: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                      <div>
                        <h4 style={{ marginTop: 0 }}>Forsideflis · Norsk</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tittel</span><input value={draft.homeTitleNo} onChange={(e) => updateDraft(product.slug, { homeTitleNo: e.target.value })} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Brødtekst</span><textarea value={draft.homeBodyNo} onChange={(e) => updateDraft(product.slug, { homeBodyNo: e.target.value })} rows={5} style={textareaStyle} /></label>
                        <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span><input value={draft.homeCtaNo} onChange={(e) => updateDraft(product.slug, { homeCtaNo: e.target.value })} style={inputStyle} /></label>
                      </div>
                      <div>
                        <h4 style={{ marginTop: 0 }}>Forsideflis · English</h4>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Title</span><input value={draft.homeTitleEn} onChange={(e) => updateDraft(product.slug, { homeTitleEn: e.target.value })} style={inputStyle} /></label>
                        <label style={{ display: "block", marginBottom: "0.75rem" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Body</span><textarea value={draft.homeBodyEn} onChange={(e) => updateDraft(product.slug, { homeBodyEn: e.target.value })} rows={5} style={textareaStyle} /></label>
                        <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span><input value={draft.homeCtaEn} onChange={(e) => updateDraft(product.slug, { homeCtaEn: e.target.value })} style={inputStyle} /></label>
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {productTextKeys[product.slug].map((textKey) => (
                        <div key={textKey} style={cardStyle}>
                          <p style={{ marginTop: 0, marginBottom: "0.35rem", fontWeight: 700 }}>{prettifyKey(textKey)}</p>
                          <p style={{ marginTop: 0, marginBottom: "0.85rem", opacity: 0.65 }}><code>{textKey}</code></p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                            <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Norsk</span><textarea value={draft.pageTextNo[textKey] ?? ""} onChange={(e) => updateProductPageText(product.slug, "no", textKey, e.target.value)} rows={3} style={textareaStyle} /></label>
                            <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>English</span><textarea value={draft.pageTextEn[textKey] ?? ""} onChange={(e) => updateProductPageText(product.slug, "en", textKey, e.target.value)} rows={3} style={textareaStyle} /></label>
                          </div>
                        </div>
                      ))}
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
                  <button type="button" className="status-button" onClick={() => setExpandedPageSlug(expanded ? null : page.slug)}>{expanded ? "Skjul felter" : "Rediger side"}</button>
                </div>
                {!expanded ? null : (
                  <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
                    {page.textKeys.map((textKey) => (
                      <div key={textKey} style={cardStyle}>
                        <p style={{ marginTop: 0, marginBottom: "0.35rem", fontWeight: 700 }}>{prettifyKey(textKey)}</p>
                        <p style={{ marginTop: 0, marginBottom: "0.85rem", opacity: 0.65 }}><code>{textKey}</code></p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                          <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Norsk</span><textarea value={draft.textNo[textKey] ?? ""} onChange={(e) => updatePageText(page.slug, "no", textKey, e.target.value)} rows={3} style={textareaStyle} /></label>
                          <label style={{ display: "block" }}><span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>English</span><textarea value={draft.textEn[textKey] ?? ""} onChange={(e) => updatePageText(page.slug, "en", textKey, e.target.value)} rows={3} style={textareaStyle} /></label>
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
