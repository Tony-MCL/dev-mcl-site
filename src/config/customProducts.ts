export type LocalizedText = {
  no: string;
  en: string;
};

export type CustomFeatureCard = {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
};

export type CustomProductStatus = "draft" | "published";

export type CustomProduct = {
  slug: string;
  routePath: string;
  visible: boolean;
  status: CustomProductStatus;
  order: number;
  imageUrl?: string;
  badge?: LocalizedText;
  homeTitle: LocalizedText;
  homeBody: LocalizedText;
  homeCta: LocalizedText;
  pageTitle: LocalizedText;
  pageTagline: LocalizedText;
  pageIntro: LocalizedText;
  featureCards: CustomFeatureCard[];
  finalTitle: LocalizedText;
  finalBody: LocalizedText;
  finalCta: LocalizedText;
  finalCtaHref: string;
};

export const CUSTOM_PRODUCTS_STORAGE_KEY = "mcl_custom_products_v1";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeLocalizedText(value: unknown, fallback = ""): LocalizedText {
  if (!isObject(value)) return { no: fallback, en: fallback };
  return {
    no: typeof value.no === "string" ? value.no : fallback,
    en: typeof value.en === "string" ? value.en : fallback,
  };
}

function sanitizeFeatureCard(value: unknown, index: number): CustomFeatureCard | null {
  if (!isObject(value)) return null;
  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : `feature-${index + 1}`,
    title: sanitizeLocalizedText(value.title),
    body: sanitizeLocalizedText(value.body),
  };
}

function sanitizeCustomProduct(value: unknown): CustomProduct | null {
  if (!isObject(value)) return null;

  const slug = typeof value.slug === "string" ? value.slug.trim().toLowerCase() : "";
  const routePathRaw = typeof value.routePath === "string" ? value.routePath.trim() : "";
  const routePath = routePathRaw.startsWith("/") ? routePathRaw : `/${routePathRaw}`;

  if (!slug || !routePath || routePath === "/") return null;

  const featureCardsRaw = Array.isArray(value.featureCards) ? value.featureCards : [];
  const featureCards = featureCardsRaw
    .map((item, index) => sanitizeFeatureCard(item, index))
    .filter((item): item is CustomFeatureCard => Boolean(item));

  return {
    slug,
    routePath,
    visible: typeof value.visible === "boolean" ? value.visible : true,
    status: value.status === "published" ? "published" : "draft",
    order: typeof value.order === "number" && Number.isFinite(value.order) ? value.order : 0,
    imageUrl: typeof value.imageUrl === "string" && value.imageUrl.trim() ? value.imageUrl.trim() : undefined,
    badge: value.badge ? sanitizeLocalizedText(value.badge) : undefined,
    homeTitle: sanitizeLocalizedText(value.homeTitle),
    homeBody: sanitizeLocalizedText(value.homeBody),
    homeCta: sanitizeLocalizedText(value.homeCta),
    pageTitle: sanitizeLocalizedText(value.pageTitle),
    pageTagline: sanitizeLocalizedText(value.pageTagline),
    pageIntro: sanitizeLocalizedText(value.pageIntro),
    featureCards,
    finalTitle: sanitizeLocalizedText(value.finalTitle),
    finalBody: sanitizeLocalizedText(value.finalBody),
    finalCta: sanitizeLocalizedText(value.finalCta),
    finalCtaHref: typeof value.finalCtaHref === "string" ? value.finalCtaHref : "mailto:post@morningcoffeelabs.no",
  };
}

function sortProducts(products: CustomProduct[]): CustomProduct[] {
  return [...products].sort((a, b) => a.order - b.order || a.homeTitle.no.localeCompare(b.homeTitle.no));
}

export function readCustomProducts(): CustomProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CUSTOM_PRODUCTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return sortProducts(
      parsed
        .map((item) => sanitizeCustomProduct(item))
        .filter((item): item is CustomProduct => Boolean(item))
    );
  } catch {
    return [];
  }
}

export function writeCustomProducts(products: CustomProduct[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(sortProducts(products)));
}

export function resetCustomProducts() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CUSTOM_PRODUCTS_STORAGE_KEY);
}

export function createEmptyCustomProduct(seed = 1): CustomProduct {
  const suffix = seed > 1 ? `-${seed}` : "";
  return {
    slug: `new-product${suffix}`,
    routePath: `/new-product${suffix}`,
    visible: true,
    status: "draft",
    order: seed,
    imageUrl: "",
    badge: { no: "App", en: "App" },
    homeTitle: { no: "Nytt produkt", en: "New product" },
    homeBody: {
      no: "Kort beskrivelse som vises på forsiden.",
      en: "Short description shown on the home page.",
    },
    homeCta: { no: "Se produkt →", en: "View product →" },
    pageTitle: { no: "Nytt produkt", en: "New product" },
    pageTagline: {
      no: "Legg inn en tydelig undertittel her.",
      en: "Add a clear product tagline here.",
    },
    pageIntro: {
      no: "Dette er en enkel produktside du kan fylle ut fra adminpanelet.",
      en: "This is a simple product page you can fill out from the admin panel.",
    },
    featureCards: [
      {
        id: "feature-1",
        title: { no: "Fordel 1", en: "Benefit 1" },
        body: { no: "Beskriv første fordel.", en: "Describe the first benefit." },
      },
      {
        id: "feature-2",
        title: { no: "Fordel 2", en: "Benefit 2" },
        body: { no: "Beskriv andre fordel.", en: "Describe the second benefit." },
      },
      {
        id: "feature-3",
        title: { no: "Fordel 3", en: "Benefit 3" },
        body: { no: "Beskriv tredje fordel.", en: "Describe the third benefit." },
      },
    ],
    finalTitle: { no: "Vil du vite mer?", en: "Want to know more?" },
    finalBody: {
      no: "Legg inn en enkel avsluttende oppfordring her.",
      en: "Add a simple closing call to action here.",
    },
    finalCta: { no: "Ta kontakt", en: "Get in touch" },
    finalCtaHref: "mailto:post@morningcoffeelabs.no",
  };
}

export function getLocalizedValue(value: LocalizedText | undefined, lang: "no" | "en", fallback = ""): string {
  if (!value) return fallback;
  return value[lang] || fallback;
}
