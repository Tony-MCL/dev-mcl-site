import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS, type ProductDefinition, type ProductSlug } from "../config/products";
import {
  PRODUCT_OVERRIDES_STORAGE_KEY,
  readProductOverrides,
  resetProductOverrides,
  writeProductOverrides,
  type ProductOverrideMap,
} from "../config/productOverrides";

type DraftField = {
  visible: boolean;
  homeTitleNo: string;
  homeTitleEn: string;
  homeBodyNo: string;
  homeBodyEn: string;
  homeCtaNo: string;
  homeCtaEn: string;
};

type DraftMap = Record<ProductSlug, DraftField>;

function buildDrafts(overrides: ProductOverrideMap, tNo: (key: string) => string, tEn: (key: string) => string): DraftMap {
  return PRODUCTS.reduce((acc, product) => {
    const override = overrides[product.slug];

    acc[product.slug] = {
      visible: override?.visible ?? true,
      homeTitleNo: override?.homeTitle?.no ?? tNo(product.home.titleKey),
      homeTitleEn: override?.homeTitle?.en ?? tEn(product.home.titleKey),
      homeBodyNo: override?.homeBody?.no ?? tNo(product.home.bodyKey),
      homeBodyEn: override?.homeBody?.en ?? tEn(product.home.bodyKey),
      homeCtaNo: override?.homeCta?.no ?? tNo(product.home.ctaKey),
      homeCtaEn: override?.homeCta?.en ?? tEn(product.home.ctaKey),
    };

    return acc;
  }, {} as DraftMap);
}

const AdminPage: React.FC = () => {
  const [drafts, setDrafts] = useState<DraftMap | null>(null);
  const [savedAt, setSavedAt] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { dictionaries, createT } = await import("../i18n");
      if (!mounted) return;

      const tNo = createT(dictionaries.no) as (key: string) => string;
      const tEn = createT(dictionaries.en) as (key: string) => string;
      setDrafts(buildDrafts(readProductOverrides(), tNo, tEn));
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  function updateDraft(slug: ProductSlug, patch: Partial<DraftField>) {
    setDrafts((current) => {
      if (!current) return current;
      return {
        ...current,
        [slug]: {
          ...current[slug],
          ...patch,
        },
      };
    });
  }

  function handleSave() {
    if (!drafts) return;

    const overrides: ProductOverrideMap = PRODUCTS.reduce((acc, product) => {
      const draft = drafts[product.slug];

      acc[product.slug] = {
        visible: draft.visible,
        homeTitle: { no: draft.homeTitleNo, en: draft.homeTitleEn },
        homeBody: { no: draft.homeBodyNo, en: draft.homeBodyEn },
        homeCta: { no: draft.homeCtaNo, en: draft.homeCtaEn },
      };

      return acc;
    }, {} as ProductOverrideMap);

    writeProductOverrides(overrides);
    setSavedAt(new Date().toLocaleString());
  }

  async function handleReset() {
    resetProductOverrides();

    const { dictionaries, createT } = await import("../i18n");
    const tNo = createT(dictionaries.no) as (key: string) => string;
    const tEn = createT(dictionaries.en) as (key: string) => string;
    setDrafts(buildDrafts({}, tNo, tEn));
    setSavedAt("");
  }

  if (!drafts) {
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
          Første versjon av kontrollpanelet. Her kan du styre synlighet og tekst for produktflisene på forsiden uten å kode.
        </p>
        <p style={{ maxWidth: 900 }}>
          Endringer i denne versjonen lagres i nettleseren på denne enheten via localStorage. Det er perfekt til å teste flyten før vi kobler på Firebase.
        </p>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button type="button" className="hero-cta" onClick={handleSave}>
            Lagre endringer
          </button>
          <button type="button" className="status-button" onClick={handleReset} style={{ cursor: "pointer" }}>
            Nullstill lokale endringer
          </button>
          <Link to="/" className="status-button" style={{ textDecoration: "none" }}>
            Se forsiden
          </Link>
        </div>

        <p style={{ marginTop: "1rem", opacity: 0.8 }}>
          Lagringsnøkkel: <code>{PRODUCT_OVERRIDES_STORAGE_KEY}</code>
          {savedAt ? ` · sist lagret ${savedAt}` : ""}
        </p>
      </section>

      <section className="intro-grid" style={{ marginTop: "2rem" }}>
        {PRODUCTS.map((product: ProductDefinition) => {
          const draft = drafts[product.slug];

          return (
            <div key={product.slug} className="intro-card" style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: "0.4rem" }}>{product.slug}</h3>
                  <p style={{ margin: 0, opacity: 0.8 }}>
                    Rute: <code>{product.routePath}</code>
                  </p>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={draft.visible}
                    onChange={(event) => updateDraft(product.slug, { visible: event.target.checked })}
                  />
                  Vis produkt på forsiden
                </label>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1rem",
                  marginTop: "1.25rem",
                }}
              >
                <div>
                  <h4 style={{ marginTop: 0 }}>Norsk</h4>

                  <label style={{ display: "block", marginBottom: "0.75rem" }}>
                    <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Tittel</span>
                    <input
                      value={draft.homeTitleNo}
                      onChange={(event) => updateDraft(product.slug, { homeTitleNo: event.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--border-color, #ccc)" }}
                    />
                  </label>

                  <label style={{ display: "block", marginBottom: "0.75rem" }}>
                    <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Brødtekst</span>
                    <textarea
                      value={draft.homeBodyNo}
                      onChange={(event) => updateDraft(product.slug, { homeBodyNo: event.target.value })}
                      rows={5}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--border-color, #ccc)", resize: "vertical" }}
                    />
                  </label>

                  <label style={{ display: "block" }}>
                    <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span>
                    <input
                      value={draft.homeCtaNo}
                      onChange={(event) => updateDraft(product.slug, { homeCtaNo: event.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--border-color, #ccc)" }}
                    />
                  </label>
                </div>

                <div>
                  <h4 style={{ marginTop: 0 }}>English</h4>

                  <label style={{ display: "block", marginBottom: "0.75rem" }}>
                    <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Title</span>
                    <input
                      value={draft.homeTitleEn}
                      onChange={(event) => updateDraft(product.slug, { homeTitleEn: event.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--border-color, #ccc)" }}
                    />
                  </label>

                  <label style={{ display: "block", marginBottom: "0.75rem" }}>
                    <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Body</span>
                    <textarea
                      value={draft.homeBodyEn}
                      onChange={(event) => updateDraft(product.slug, { homeBodyEn: event.target.value })}
                      rows={5}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--border-color, #ccc)", resize: "vertical" }}
                    />
                  </label>

                  <label style={{ display: "block" }}>
                    <span style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>CTA</span>
                    <input
                      value={draft.homeCtaEn}
                      onChange={(event) => updateDraft(product.slug, { homeCtaEn: event.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--border-color, #ccc)" }}
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default AdminPage;
