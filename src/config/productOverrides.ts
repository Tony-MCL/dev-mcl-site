import type { Lang } from "../i18n";
import type { ProductDefinition, ProductSlug } from "./products";

export type ProductOverride = {
  visible?: boolean;
  homeTitle?: Partial<Record<Lang, string>>;
  homeBody?: Partial<Record<Lang, string>>;
  homeCta?: Partial<Record<Lang, string>>;
};

export type ProductOverrideMap = Partial<Record<ProductSlug, ProductOverride>>;

export const PRODUCT_OVERRIDES_STORAGE_KEY = "mcl_product_overrides_v1";

export function readProductOverrides(): ProductOverrideMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(PRODUCT_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProductOverrideMap;
    return parsed ?? {};
  } catch {
    return {};
  }
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
