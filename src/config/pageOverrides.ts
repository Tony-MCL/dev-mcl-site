import type { Lang } from "../i18n";

export type EditablePageSlug =
  | "about"
  | "services"
  | "contact"
  | "purchase"
  | "terms"
  | "privacy"
  | "refund";

export type PageTextOverride = {
  no?: string;
  en?: string;
};

export type PageOverrideMap = Partial<
  Record<EditablePageSlug, Record<string, PageTextOverride>>
>;

export const PAGE_OVERRIDES_STORAGE_KEY = "mcl_page_overrides_v2";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeLangValue(value: unknown): PageTextOverride | undefined {
  if (!isObject(value)) return undefined;

  const out: PageTextOverride = {};
  if (typeof value.no === "string") out.no = value.no;
  if (typeof value.en === "string") out.en = value.en;

  return Object.keys(out).length ? out : undefined;
}

function sanitizePageEntry(value: unknown): Record<string, PageTextOverride> | undefined {
  if (!isObject(value)) return undefined;

  const out: Record<string, PageTextOverride> = {};
  for (const [textKey, langMap] of Object.entries(value)) {
    const sanitized = sanitizeLangValue(langMap);
    if (sanitized) out[textKey] = sanitized;
  }

  return Object.keys(out).length ? out : undefined;
}

function sanitizeOverrideMap(value: unknown): PageOverrideMap {
  if (!isObject(value)) return {};

  const out: PageOverrideMap = {};
  for (const [pageSlug, pageEntry] of Object.entries(value)) {
    const sanitized = sanitizePageEntry(pageEntry);
    if (sanitized) out[pageSlug as EditablePageSlug] = sanitized;
  }

  return out;
}

export function readPageOverrides(): PageOverrideMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(PAGE_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeOverrideMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function writePageOverrides(overrides: PageOverrideMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PAGE_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

export function resetPageOverrides() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PAGE_OVERRIDES_STORAGE_KEY);
}

export function getPageTextValue(
  pageSlug: EditablePageSlug,
  textKey: string,
  lang: Lang,
  fallback: string,
  overrides?: PageOverrideMap
): string {
  const source = overrides ?? readPageOverrides();
  return source[pageSlug]?.[textKey]?.[lang] ?? fallback;
}
