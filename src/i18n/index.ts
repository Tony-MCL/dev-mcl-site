import no from "./no";
import en from "./en";

export type Lang = "no" | "en";

export const dictionaries = {
  no,
  en,
} as const;

export const DEFAULT_LANG: Lang = "no";
export const LANG_STORAGE_KEY = "mcl_lang";

// Dette er nøkkelen: Dict er "språkunion", ikke låst til NO
export type Dict = (typeof dictionaries)[Lang];

export function getInitialLang(): Lang {
  // 1) Brukerens valg (lagret) vinner alltid
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === "no" || saved === "en") return saved;

  // 2) Nettleserens språk (første besøk)
  const candidates: string[] =
    Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

  for (const raw of candidates) {
    const tag = (raw || "").toLowerCase(); // f.eks. "en-US", "nb-NO"
    if (tag.startsWith("en")) return "en";
    if (tag.startsWith("no") || tag.startsWith("nb") || tag.startsWith("nn"))
      return "no";
  }

  // 3) Fallback
  return DEFAULT_LANG;
}

// Enkel deep-get med dotted path, f.eks. "header.nav.home"
function deepGet(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce((acc: any, key) => (acc ? acc[key] : undefined), obj as any);
}

export function createT(dict: Dict) {
  return function t<T = unknown>(key: string): T {
    const v = deepGet(dict, key);
    return (v === undefined ? (key as unknown) : v) as T;
  };
}
