
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import {
  PRODUCTS,
  type ProductContentBlock,
  type ProductDefinition,
  type ProductSlug,
} from "../config/products";
import {
  readProductOverrides,
  writeProductOverrides,
  type ProductOverrideMap,
} from "../config/productOverrides";
import {
  EDITABLE_PAGES,
  type EditablePageDefinition,
} from "../config/editablePages";
import {
  readPageOverrides,
  writePageOverrides,
  type EditablePageSlug,
  type PageOverrideMap,
} from "../config/pageOverrides";
import {
  createEmptyCustomProduct,
  readCustomProducts,
  writeCustomProducts,
  type CustomProduct,
} from "../config/customProducts";

type AdminView = "info" | "stats" | "settings" | "create" | "pages" | "products" | "customProducts" | "editor";
type EditorTarget =
  | { type: "product"; slug: ProductSlug }
  | { type: "customProduct"; slug: string }
  | { type: "page"; slug: EditablePageSlug };

type NavItem =
  | { kind: "page"; slug: EditablePageSlug; title: string; routePath: string }
  | { kind: "product"; slug: ProductSlug; title: string; routePath: string }
  | { kind: "customProduct"; slug: string; title: string; routePath: string; status: string };

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.9rem",
  borderRadius: 10,
  border: "1px solid var(--line, rgba(255,255,255,0.12))",
  background: "var(--panel, rgba(255,255,255,0.04))",
  color: "inherit",
  font: "inherit",
};

const TEXTAREA_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  minHeight: 110,
  resize: "vertical",
};

const CARD_STYLE: React.CSSProperties = {
  border: "1px solid var(--line, rgba(255,255,255,0.12))",
  borderRadius: 18,
  padding: "1rem",
  background: "var(--panel, rgba(255,255,255,0.04))",
};

function sidebarButtonStyle(active = false): React.CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    padding: "0.55rem 0.7rem",
    borderRadius: 10,
    border: "1px solid transparent",
    background: active ? "rgba(117,170,255,0.14)" : "transparent",
    color: "inherit",
    cursor: "pointer",
    font: "inherit",
    fontWeight: active ? 700 : 500,
  };
}

function sectionTitleStyle(): React.CSSProperties {
  return {
    fontSize: "0.78rem",
    opacity: 0.65,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "1rem 0 0.45rem",
  };
}

function listButtonStyle(active = false): React.CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    padding: "0.8rem 0.9rem",
    borderRadius: 12,
    border: active ? "1px solid rgba(117,170,255,0.55)" : "1px solid var(--line, rgba(255,255,255,0.12))",
    background: active ? "rgba(117,170,255,0.12)" : "var(--panel, rgba(255,255,255,0.04))",
    color: "inherit",
    cursor: "pointer",
    font: "inherit",
  };
}

function toLabel(key: string): string {
  return key
    .split(".")
    .slice(-2)
    .join(" · ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}

function getProductTitle(product: ProductDefinition, t: (key: string) => string): string {
  return t(product.home.titleKey);
}

function collectProductTextKeys(product: ProductDefinition): string[] {
  const out = new Set<string>();

  const addBlock = (block: ProductContentBlock) => {
    switch (block.type) {
      case "hero":
        if (block.titleKey) out.add(block.titleKey);
        if (block.taglineKey) out.add(block.taglineKey);
        block.bodyKeys?.forEach((x) => out.add(x));
        if (block.cta) out.add(block.cta.labelKey);
        break;
      case "heroSplit":
        if (block.titleKey) out.add(block.titleKey);
        if (block.taglineKey) out.add(block.taglineKey);
        block.bodyKeys?.forEach((x) => out.add(x));
        if (block.cta) out.add(block.cta.labelKey);
        if (block.image.altKey) out.add(block.image.altKey);
        break;
      case "imageGrid":
        if (block.titleKey) out.add(block.titleKey);
        block.items.forEach((item) => out.add(item.altKey));
        break;
      case "figureGrid":
        if (block.titleKey) out.add(block.titleKey);
        block.items.forEach((item) => {
          out.add(item.altKey);
          out.add(item.captionKey);
        });
        break;
      case "bulletCard":
        block.bulletKeys.forEach((x) => out.add(x));
        block.strongBodyKeys?.forEach((x) => out.add(x));
        break;
      case "cardsGrid":
        block.items.forEach((item) => {
          out.add(item.titleKey);
          item.bodyKeys.forEach((x) => out.add(x));
          if (item.cta) out.add(item.cta.labelKey);
        });
        break;
      case "flowColumns":
        block.columns.forEach((column) => {
          out.add(column.titleKey);
          column.blocks.forEach((sub) => {
            out.add(sub.titleKey);
            sub.bodyKeys.forEach((x) => out.add(x));
          });
        });
        break;
      case "bottomCards":
        block.items.forEach((item) => {
          out.add(item.titleKey);
          item.bodyKeys.forEach((x) => out.add(x));
        });
        break;
      case "cta":
        out.add(block.titleKey);
        out.add(block.subKey);
        out.add(block.button.labelKey);
        out.add(block.noteKey);
        break;
    }
  };

  product.blocks.forEach(addBlock);
  return [...out];
}

function statusLabel(status: "draft" | "published") {
  return status === "draft" ? "Kladd" : "Publisert";
}

const AdminPage: React.FC = () => {
  const { t } = useI18n();
  const [view, setView] = useState<AdminView>("info");
  const [selectedTarget, setSelectedTarget] = useState<EditorTarget | null>(null);
  const [productOverrides, setProductOverrides] = useState<ProductOverrideMap>({});
  const [pageOverrides, setPageOverrides] = useState<PageOverrideMap>({});
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>("");

  useEffect(() => {
    setProductOverrides(readProductOverrides());
    setPageOverrides(readPageOverrides());
    setCustomProducts(readCustomProducts());
  }, []);

  useEffect(() => {
    if (!saveMessage) return;
    const timer = window.setTimeout(() => setSaveMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [saveMessage]);

  const pageItems: Array<Extract<NavItem, { kind: "page" }>> = useMemo(
    () =>
      EDITABLE_PAGES.map((page) => ({
        kind: "page",
        slug: page.slug,
        title: page.title,
        routePath: page.routePath,
      })),
    []
  );

  const productItems: Array<Extract<NavItem, { kind: "product" }>> = useMemo(
    () =>
      PRODUCTS.map((product) => ({
        kind: "product",
        slug: product.slug,
        title: getProductTitle(product, t),
        routePath: product.routePath,
      })),
    [t]
  );

  const customProductItems: Array<Extract<NavItem, { kind: "customProduct" }>> = useMemo(
    () =>
      [...customProducts]
        .sort((a, b) => a.order - b.order)
        .map((product) => ({
          kind: "customProduct",
          slug: product.slug,
          title: product.homeTitle.no || product.slug,
          routePath: product.routePath,
          status: product.status,
        })),
    [customProducts]
  );

  const stats = {
    totalPages: pageItems.length,
    totalBaseProducts: productItems.length,
    totalCustomProducts: customProductItems.length,
    totalDrafts: customProducts.filter((item) => item.status === "draft").length,
    totalPublished: customProducts.filter((item) => item.status === "published").length,
  };

  const openTarget = (target: EditorTarget) => {
    setSelectedTarget(target);
    setView("editor");
  };

  const saveAll = () => {
    writeProductOverrides(productOverrides);
    writePageOverrides(pageOverrides);
    writeCustomProducts(customProducts);
    setSaveMessage("Endringer lagret lokalt på denne enheten.");
  };

  const createNewProduct = () => {
    const seed = customProducts.length + 1;
    const created = createEmptyCustomProduct(seed);
    let counter = seed;
    const taken = new Set<string>([
      ...PRODUCTS.map((product) => product.slug),
      ...customProducts.map((product) => product.slug),
    ]);

    while (taken.has(created.slug)) {
      counter += 1;
      Object.assign(created, createEmptyCustomProduct(counter));
    }

    const next = [...customProducts, created];
    setCustomProducts(next);
    setSelectedTarget({ type: "customProduct", slug: created.slug });
    setView("editor");
    setSaveMessage("Nytt produkt opprettet. Husk å lagre når du er ferdig.");
  };

  const updatePageField = (
    pageSlug: EditablePageSlug,
    textKey: string,
    lang: "no" | "en",
    value: string
  ) => {
    setPageOverrides((prev) => ({
      ...prev,
      [pageSlug]: {
        ...(prev[pageSlug] ?? {}),
        [textKey]: {
          ...(prev[pageSlug]?.[textKey] ?? {}),
          [lang]: value,
        },
      },
    }));
  };

  const updateProductOverrideField = (
    slug: ProductSlug,
    field: "homeTitle" | "homeBody" | "homeCta",
    lang: "no" | "en",
    value: string
  ) => {
    setProductOverrides((prev) => ({
      ...prev,
      [slug]: {
        ...(prev[slug] ?? {}),
        [field]: {
          ...(prev[slug]?.[field] ?? {}),
          [lang]: value,
        },
      },
    }));
  };

  const updateProductTextField = (
    slug: ProductSlug,
    textKey: string,
    lang: "no" | "en",
    value: string
  ) => {
    setProductOverrides((prev) => ({
      ...prev,
      [slug]: {
        ...(prev[slug] ?? {}),
        pageText: {
          ...(prev[slug]?.pageText ?? {}),
          [textKey]: {
            ...(prev[slug]?.pageText?.[textKey] ?? {}),
            [lang]: value,
          },
        },
      },
    }));
  };

  const updateCustomProduct = (slug: string, updater: (product: CustomProduct) => CustomProduct) => {
    setCustomProducts((prev) => prev.map((product) => (product.slug === slug ? updater(product) : product)));
  };

  const selectedPageDef =
    selectedTarget?.type === "page"
      ? EDITABLE_PAGES.find((page) => page.slug === selectedTarget.slug)
      : null;

  const selectedBaseProduct =
    selectedTarget?.type === "product"
      ? PRODUCTS.find((product) => product.slug === selectedTarget.slug)
      : null;

  const selectedCustomProduct =
    selectedTarget?.type === "customProduct"
      ? customProducts.find((product) => product.slug === selectedTarget.slug)
      : null;

  return (
    <main className="page" style={{ maxWidth: 1440 }}>
      <div style={{ display: "grid", gridTemplateColumns: "240px minmax(0, 1fr)", gap: "1rem" }}>
        <aside style={{ ...CARD_STYLE, position: "sticky", top: 24, alignSelf: "start", padding: "0.9rem" }}>
          <h1 style={{ marginTop: 0, marginBottom: "0.2rem", fontSize: "1.3rem" }}>Admin</h1>
          <p style={{ marginTop: 0, marginBottom: "0.8rem", opacity: 0.7, fontSize: "0.94rem" }}>
            Kontrollpanel for nettsted og innhold.
          </p>

          <div style={sectionTitleStyle()}>System</div>
          <div style={{ display: "grid", gap: "0.25rem" }}>
            <button type="button" style={sidebarButtonStyle(view === "info")} onClick={() => setView("info")}>
              Informasjon
            </button>
            <button type="button" style={sidebarButtonStyle(view === "stats")} onClick={() => setView("stats")}>
              Statistikk
            </button>
            <button type="button" style={sidebarButtonStyle(view === "settings")} onClick={() => setView("settings")}>
              Globale innstillinger
            </button>
            <button type="button" style={sidebarButtonStyle(view === "create")} onClick={() => setView("create")}>
              Opprett ny side
            </button>
          </div>

          <div style={sectionTitleStyle()}>Innhold</div>
          <div style={{ display: "grid", gap: "0.25rem" }}>
            <button type="button" style={sidebarButtonStyle(view === "pages")} onClick={() => setView("pages")}>
              Sider
            </button>
            <button type="button" style={sidebarButtonStyle(view === "products")} onClick={() => setView("products")}>
              Produkter
            </button>
            <button
              type="button"
              style={sidebarButtonStyle(view === "customProducts")}
              onClick={() => setView("customProducts")}
            >
              Egne produkter
            </button>
          </div>

          <div style={{ marginTop: "1rem", display: "grid", gap: "0.65rem" }}>
            <button type="button" className="status-button" onClick={saveAll}>
              Lagre endringer
            </button>
            {saveMessage ? <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>{saveMessage}</p> : null}
          </div>
        </aside>

        <section style={{ display: "grid", gap: "1rem" }}>
          {view === "info" ? (
            <div style={CARD_STYLE}>
              <h2 style={{ marginTop: 0 }}>Informasjon</h2>
              <p>
                Dette er startsiden for adminpanelet. Herfra kan du åpne eksisterende sider,
                produkter og egne produkter for redigering.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "0.9rem",
                  marginTop: "1rem",
                }}
              >
                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Hva du kan lese her</h3>
                  <p style={{ marginBottom: 0 }}>Status, sideoversikt, produktoversikt og enkel intern statistikk.</p>
                </div>
                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Hva du kan redigere</h3>
                  <p style={{ marginBottom: 0 }}>Innholdssider, forsidefliser, produktsidetekster og egne produkter.</p>
                </div>
                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Hvordan lagring fungerer nå</h3>
                  <p style={{ marginBottom: 0 }}>Foreløpig lagres alt lokalt i nettleseren på denne enheten.</p>
                </div>
              </div>
            </div>
          ) : null}

          {view === "stats" ? (
            <div style={CARD_STYLE}>
              <h2 style={{ marginTop: 0 }}>Statistikk</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.9rem" }}>
                <div style={CARD_STYLE}>
                  <strong>{stats.totalPages}</strong>
                  <p style={{ marginBottom: 0 }}>Redigerbare sider</p>
                </div>
                <div style={CARD_STYLE}>
                  <strong>{stats.totalBaseProducts}</strong>
                  <p style={{ marginBottom: 0 }}>Eksisterende produkter</p>
                </div>
                <div style={CARD_STYLE}>
                  <strong>{stats.totalCustomProducts}</strong>
                  <p style={{ marginBottom: 0 }}>Egne produkter</p>
                </div>
                <div style={CARD_STYLE}>
                  <strong>{stats.totalDrafts}</strong>
                  <p style={{ marginBottom: 0 }}>Kladder</p>
                </div>
                <div style={CARD_STYLE}>
                  <strong>{stats.totalPublished}</strong>
                  <p style={{ marginBottom: 0 }}>Publiserte egne produkter</p>
                </div>
              </div>
            </div>
          ) : null}

          {view === "settings" ? (
            <div style={CARD_STYLE}>
              <h2 style={{ marginTop: 0 }}>Globale innstillinger</h2>
              <p>Denne seksjonen er klargjort, men ikke koblet til ekte globale innstillinger ennå.</p>
            </div>
          ) : null}

          {view === "create" ? (
            <div style={CARD_STYLE}>
              <h2 style={{ marginTop: 0 }}>Opprett ny side</h2>
              <p>
                Neste del av systemet blir felles sideopprettelse. Foreløpig bruker denne funksjonen
                den delen som allerede fungerer best: oppretting av nytt produkt.
              </p>
              <button type="button" className="status-button" onClick={createNewProduct}>
                Opprett nytt produktutkast
              </button>
            </div>
          ) : null}

          {view === "pages" ? (
            <div style={CARD_STYLE}>
              <h2 style={{ marginTop: 0 }}>Sider</h2>
              <p style={{ opacity: 0.76 }}>Velg en side for å åpne editoren.</p>
              <div style={{ display: "grid", gap: "0.7rem", marginTop: "1rem" }}>
                {pageItems.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    style={listButtonStyle(selectedTarget?.type === "page" && selectedTarget.slug === item.slug)}
                    onClick={() => openTarget({ type: "page", slug: item.slug })}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                      <span style={{ fontWeight: 700 }}>{item.title}</span>
                      <span style={{ opacity: 0.65, fontSize: "0.9rem" }}>{item.routePath}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {view === "products" ? (
            <div style={CARD_STYLE}>
              <h2 style={{ marginTop: 0 }}>Produkter</h2>
              <p style={{ opacity: 0.76 }}>Eksisterende produkter som allerede ligger i systemet.</p>
              <div style={{ display: "grid", gap: "0.7rem", marginTop: "1rem" }}>
                {productItems.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    style={listButtonStyle(selectedTarget?.type === "product" && selectedTarget.slug === item.slug)}
                    onClick={() => openTarget({ type: "product", slug: item.slug })}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                      <span style={{ fontWeight: 700 }}>{item.title}</span>
                      <span style={{ opacity: 0.65, fontSize: "0.9rem" }}>{item.routePath}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {view === "customProducts" ? (
            <div style={CARD_STYLE}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                <div>
                  <h2 style={{ marginTop: 0, marginBottom: "0.2rem" }}>Egne produkter</h2>
                  <p style={{ margin: 0, opacity: 0.76 }}>Produkter du har opprettet selv i adminpanelet.</p>
                </div>
                <button type="button" className="status-button" onClick={createNewProduct}>
                  Opprett nytt produktutkast
                </button>
              </div>

              <div style={{ display: "grid", gap: "0.7rem", marginTop: "1rem" }}>
                {customProductItems.length ? (
                  customProductItems.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      style={listButtonStyle(selectedTarget?.type === "customProduct" && selectedTarget.slug === item.slug)}
                      onClick={() => openTarget({ type: "customProduct", slug: item.slug })}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
                        <span style={{ fontWeight: 700 }}>{item.title}</span>
                        <span style={{ opacity: 0.65, fontSize: "0.9rem" }}>{statusLabel(item.status as "draft" | "published")}</span>
                      </div>
                      <div style={{ marginTop: "0.35rem", opacity: 0.65, fontSize: "0.9rem" }}>{item.routePath}</div>
                    </button>
                  ))
                ) : (
                  <div style={CARD_STYLE}>
                    <p style={{ margin: 0 }}>Ingen egne produkter ennå.</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {view === "editor" && selectedPageDef ? (
            <div style={CARD_STYLE}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start" }}>
                <div>
                  <h2 style={{ marginTop: 0, marginBottom: "0.3rem" }}>{selectedPageDef.title}</h2>
                  <p style={{ margin: 0, opacity: 0.72 }}>Route: {selectedPageDef.routePath}</p>
                </div>
                <Link to={selectedPageDef.routePath} className="status-button" style={{ textDecoration: "none" }}>
                  Åpne side
                </Link>
              </div>

              <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                {selectedPageDef.textKeys.map((textKey) => (
                  <div key={textKey} style={CARD_STYLE}>
                    <p style={{ marginTop: 0, fontWeight: 700 }}>{toLabel(textKey)}</p>
                    <p style={{ marginTop: 0, fontSize: "0.9rem", opacity: 0.68 }}>{textKey}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                      <label>
                        <span style={{ display: "block", marginBottom: "0.35rem" }}>NO</span>
                        <textarea
                          style={TEXTAREA_STYLE}
                          value={pageOverrides[selectedPageDef.slug]?.[textKey]?.no ?? ""}
                          onChange={(e) => updatePageField(selectedPageDef.slug, textKey, "no", e.target.value)}
                        />
                      </label>
                      <label>
                        <span style={{ display: "block", marginBottom: "0.35rem" }}>EN</span>
                        <textarea
                          style={TEXTAREA_STYLE}
                          value={pageOverrides[selectedPageDef.slug]?.[textKey]?.en ?? ""}
                          onChange={(e) => updatePageField(selectedPageDef.slug, textKey, "en", e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {view === "editor" && selectedBaseProduct ? (
            <div style={CARD_STYLE}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start" }}>
                <div>
                  <h2 style={{ marginTop: 0, marginBottom: "0.3rem" }}>{getProductTitle(selectedBaseProduct, t)}</h2>
                  <p style={{ margin: 0, opacity: 0.72 }}>Route: {selectedBaseProduct.routePath}</p>
                </div>
                <Link to={selectedBaseProduct.routePath} className="status-button" style={{ textDecoration: "none" }}>
                  Åpne produktside
                </Link>
              </div>

              <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Forsideflis</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Tittel · NO</span>
                      <input
                        style={INPUT_STYLE}
                        value={productOverrides[selectedBaseProduct.slug]?.homeTitle?.no ?? ""}
                        onChange={(e) => updateProductOverrideField(selectedBaseProduct.slug, "homeTitle", "no", e.target.value)}
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Tittel · EN</span>
                      <input
                        style={INPUT_STYLE}
                        value={productOverrides[selectedBaseProduct.slug]?.homeTitle?.en ?? ""}
                        onChange={(e) => updateProductOverrideField(selectedBaseProduct.slug, "homeTitle", "en", e.target.value)}
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Brødtekst · NO</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={productOverrides[selectedBaseProduct.slug]?.homeBody?.no ?? ""}
                        onChange={(e) => updateProductOverrideField(selectedBaseProduct.slug, "homeBody", "no", e.target.value)}
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Brødtekst · EN</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={productOverrides[selectedBaseProduct.slug]?.homeBody?.en ?? ""}
                        onChange={(e) => updateProductOverrideField(selectedBaseProduct.slug, "homeBody", "en", e.target.value)}
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>CTA · NO</span>
                      <input
                        style={INPUT_STYLE}
                        value={productOverrides[selectedBaseProduct.slug]?.homeCta?.no ?? ""}
                        onChange={(e) => updateProductOverrideField(selectedBaseProduct.slug, "homeCta", "no", e.target.value)}
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>CTA · EN</span>
                      <input
                        style={INPUT_STYLE}
                        value={productOverrides[selectedBaseProduct.slug]?.homeCta?.en ?? ""}
                        onChange={(e) => updateProductOverrideField(selectedBaseProduct.slug, "homeCta", "en", e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Produktsidetekster</h3>
                  <div style={{ display: "grid", gap: "0.9rem" }}>
                    {collectProductTextKeys(selectedBaseProduct).map((textKey) => (
                      <div key={textKey} style={CARD_STYLE}>
                        <p style={{ marginTop: 0, fontWeight: 700 }}>{toLabel(textKey)}</p>
                        <p style={{ marginTop: 0, fontSize: "0.9rem", opacity: 0.68 }}>{textKey}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                          <label>
                            <span style={{ display: "block", marginBottom: "0.35rem" }}>NO</span>
                            <textarea
                              style={TEXTAREA_STYLE}
                              value={productOverrides[selectedBaseProduct.slug]?.pageText?.[textKey]?.no ?? ""}
                              onChange={(e) => updateProductTextField(selectedBaseProduct.slug, textKey, "no", e.target.value)}
                            />
                          </label>
                          <label>
                            <span style={{ display: "block", marginBottom: "0.35rem" }}>EN</span>
                            <textarea
                              style={TEXTAREA_STYLE}
                              value={productOverrides[selectedBaseProduct.slug]?.pageText?.[textKey]?.en ?? ""}
                              onChange={(e) => updateProductTextField(selectedBaseProduct.slug, textKey, "en", e.target.value)}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {view === "editor" && selectedCustomProduct ? (
            <div style={CARD_STYLE}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start" }}>
                <div>
                  <h2 style={{ marginTop: 0, marginBottom: "0.3rem" }}>
                    {selectedCustomProduct.homeTitle.no || selectedCustomProduct.slug}
                  </h2>
                  <p style={{ margin: 0, opacity: 0.72 }}>Route: {selectedCustomProduct.routePath}</p>
                </div>
                <Link to={selectedCustomProduct.routePath} className="status-button" style={{ textDecoration: "none" }}>
                  Åpne produktside
                </Link>
              </div>

              <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Status og identitet</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.9rem" }}>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Slug</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.slug}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            slug: e.target.value.trim().toLowerCase(),
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Route</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.routePath}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            routePath: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Status</span>
                      <select
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.status}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            status: e.target.value as "draft" | "published",
                          }))
                        }
                      >
                        <option value="draft">Kladd</option>
                        <option value="published">Publisert</option>
                      </select>
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Rekkefølge</span>
                      <input
                        type="number"
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.order}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            order: Number(e.target.value) || 0,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <label style={{ display: "block", marginTop: "0.9rem" }}>
                    <input
                      type="checkbox"
                      checked={selectedCustomProduct.visible}
                      onChange={(e) =>
                        updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                          ...product,
                          visible: e.target.checked,
                        }))
                      }
                    />
                    <span style={{ marginLeft: "0.5rem" }}>Vis produktet på forsiden</span>
                  </label>
                </div>

                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Forsideflis</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Badge · NO</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.badge?.no ?? ""}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            badge: { no: e.target.value, en: product.badge?.en ?? "" },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Badge · EN</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.badge?.en ?? ""}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            badge: { no: product.badge?.no ?? "", en: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Tittel · NO</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.homeTitle.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            homeTitle: { ...product.homeTitle, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Tittel · EN</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.homeTitle.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            homeTitle: { ...product.homeTitle, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Brødtekst · NO</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={selectedCustomProduct.homeBody.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            homeBody: { ...product.homeBody, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Brødtekst · EN</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={selectedCustomProduct.homeBody.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            homeBody: { ...product.homeBody, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>CTA · NO</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.homeCta.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            homeCta: { ...product.homeCta, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>CTA · EN</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.homeCta.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            homeCta: { ...product.homeCta, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>

                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Produktside</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Sidetittel · NO</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.pageTitle.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            pageTitle: { ...product.pageTitle, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Sidetittel · EN</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.pageTitle.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            pageTitle: { ...product.pageTitle, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Tagline · NO</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={selectedCustomProduct.pageTagline.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            pageTagline: { ...product.pageTagline, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Tagline · EN</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={selectedCustomProduct.pageTagline.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            pageTagline: { ...product.pageTagline, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label style={{ gridColumn: "1 / -1" }}>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Bilde-URL</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.imageUrl ?? ""}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            imageUrl: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Intro · NO</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={selectedCustomProduct.pageIntro.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            pageIntro: { ...product.pageIntro, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Intro · EN</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={selectedCustomProduct.pageIntro.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            pageIntro: { ...product.pageIntro, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>

                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Fordelskort</h3>
                  <div style={{ display: "grid", gap: "0.9rem" }}>
                    {selectedCustomProduct.featureCards.map((card) => (
                      <div key={card.id} style={CARD_STYLE}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                          <label>
                            <span style={{ display: "block", marginBottom: "0.35rem" }}>Tittel · NO</span>
                            <input
                              style={INPUT_STYLE}
                              value={card.title.no}
                              onChange={(e) =>
                                updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                                  ...product,
                                  featureCards: product.featureCards.map((item) =>
                                    item.id === card.id ? { ...item, title: { ...item.title, no: e.target.value } } : item
                                  ),
                                }))
                              }
                            />
                          </label>
                          <label>
                            <span style={{ display: "block", marginBottom: "0.35rem" }}>Tittel · EN</span>
                            <input
                              style={INPUT_STYLE}
                              value={card.title.en}
                              onChange={(e) =>
                                updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                                  ...product,
                                  featureCards: product.featureCards.map((item) =>
                                    item.id === card.id ? { ...item, title: { ...item.title, en: e.target.value } } : item
                                  ),
                                }))
                              }
                            />
                          </label>
                          <label>
                            <span style={{ display: "block", marginBottom: "0.35rem" }}>Brødtekst · NO</span>
                            <textarea
                              style={TEXTAREA_STYLE}
                              value={card.body.no}
                              onChange={(e) =>
                                updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                                  ...product,
                                  featureCards: product.featureCards.map((item) =>
                                    item.id === card.id ? { ...item, body: { ...item.body, no: e.target.value } } : item
                                  ),
                                }))
                              }
                            />
                          </label>
                          <label>
                            <span style={{ display: "block", marginBottom: "0.35rem" }}>Brødtekst · EN</span>
                            <textarea
                              style={TEXTAREA_STYLE}
                              value={card.body.en}
                              onChange={(e) =>
                                updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                                  ...product,
                                  featureCards: product.featureCards.map((item) =>
                                    item.id === card.id ? { ...item, body: { ...item.body, en: e.target.value } } : item
                                  ),
                                }))
                              }
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={CARD_STYLE}>
                  <h3 style={{ marginTop: 0 }}>Avslutning</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Tittel · NO</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.finalTitle.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            finalTitle: { ...product.finalTitle, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Tittel · EN</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.finalTitle.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            finalTitle: { ...product.finalTitle, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Brødtekst · NO</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={selectedCustomProduct.finalBody.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            finalBody: { ...product.finalBody, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>Brødtekst · EN</span>
                      <textarea
                        style={TEXTAREA_STYLE}
                        value={selectedCustomProduct.finalBody.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            finalBody: { ...product.finalBody, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>CTA · NO</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.finalCta.no}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            finalCta: { ...product.finalCta, no: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>CTA · EN</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.finalCta.en}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            finalCta: { ...product.finalCta, en: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label style={{ gridColumn: "1 / -1" }}>
                      <span style={{ display: "block", marginBottom: "0.35rem" }}>CTA-lenke</span>
                      <input
                        style={INPUT_STYLE}
                        value={selectedCustomProduct.finalCtaHref}
                        onChange={(e) =>
                          updateCustomProduct(selectedCustomProduct.slug, (product) => ({
                            ...product,
                            finalCtaHref: e.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default AdminPage;
