import type { Lang } from "../i18n";
import type { ProductDefinition, ProductSlug } from "./products";

export type ProductTextOverrideMap = Partial<Record<string, Partial<Record<Lang, string>>>>;

export type ProductOverride = {
  visible?: boolean;
  homeTitle?: Partial<Record<Lang, string>>;
  homeBody?: Partial<Record<Lang, string>>;
  homeCta?: Partial<Record<Lang, string>>;
  pageText?: ProductTextOverrideMap;
};

export type ProductOverrideMap = Partial<Record<ProductSlug, ProductOverride>>;

const PRODUCT_OVERRIDES_STORAGE_KEY_V1 = "mcl_product_overrides_v1";
export const PRODUCT_OVERRIDES_STORAGE_KEY = "mcl_product_overrides_v2";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeLangMap(value: unknown): Partial<Record<Lang, string>> | undefined {
  if (!isObject(value)) return undefined;

  const out: Partial<Record<Lang, string>> = {};
  if (typeof value.no === "string") out.no = value.no;
  if (typeof value.en === "string") out.en = value.en;

  return Object.keys(out).length ? out : undefined;
}

function sanitizePageText(value: unknown): ProductTextOverrideMap | undefined {
  if (!isObject(value)) return undefined;

  const out: ProductTextOverrideMap = {};

  for (const [textKey, langMap] of Object.entries(value)) {
    const sanitized = sanitizeLangMap(langMap);
    if (sanitized) out[textKey] = sanitized;
  }

  return Object.keys(out).length ? out : undefined;
}

function sanitizeOverride(value: unknown): ProductOverride | undefined {
  if (!isObject(value)) return undefined;

  const out: ProductOverride = {};

  if (typeof value.visible === "boolean") out.visible = value.visible;

  const homeTitle = sanitizeLangMap(value.homeTitle);
  const homeBody = sanitizeLangMap(value.homeBody);
  const homeCta = sanitizeLangMap(value.homeCta);
  const pageText = sanitizePageText(value.pageText);

  if (homeTitle) out.homeTitle = homeTitle;
  if (homeBody) out.homeBody = homeBody;
  if (homeCta) out.homeCta = homeCta;
  if (pageText) out.pageText = pageText;

  return Object.keys(out).length ? out : undefined;
}

function sanitizeOverrideMap(value: unknown): ProductOverrideMap {
  if (!isObject(value)) return {};

  const out: ProductOverrideMap = {};

  for (const [slug, override] of Object.entries(value)) {
    const sanitized = sanitizeOverride(override);
    if (sanitized) out[slug as ProductSlug] = sanitized;
  }

  return out;
}

function readRawStorage(key: string): ProductOverrideMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    return sanitizeOverrideMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function readProductOverrides(): ProductOverrideMap {
  const current = readRawStorage(PRODUCT_OVERRIDES_STORAGE_KEY);
  if (Object.keys(current).length > 0) return current;

  const legacy = readRawStorage(PRODUCT_OVERRIDES_STORAGE_KEY_V1);
  if (Object.keys(legacy).length > 0 && typeof window !== "undefined") {
    window.localStorage.setItem(PRODUCT_OVERRIDES_STORAGE_KEY, JSON.stringify(legacy));
  }

  return legacy;
}

export function writeProductOverrides(overrides: ProductOverrideMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRODUCT_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

export function resetProductOverrides() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PRODUCT_OVERRIDES_STORAGE_KEY);
}

export function getProductVisibility(product: ProductDefinition, overrides: ProductOverrideMap): boolean {
  return overrides[product.slug]?.visible ?? true;
}

export function getHomeCardValue(
  product: ProductDefinition,
  overrides: ProductOverrideMap,
  lang: Lang,
  fallback: string,
  field: "homeTitle" | "homeBody" | "homeCta"
): string {
  return overrides[product.slug]?.[field]?.[lang] ?? fallback;
}

export function getProductTextValue(
  slug: ProductSlug,
  textKey: string,
  lang: Lang,
  fallback: string,
  overrides?: ProductOverrideMap
): string {
  const source = overrides ?? readProductOverrides();
  return source[slug]?.pageText?.[textKey]?.[lang] ?? fallback;
}
