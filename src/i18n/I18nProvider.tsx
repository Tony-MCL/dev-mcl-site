import React, { createContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, dictionaries, Lang, LANG_STORAGE_KEY, createT, getInitialLang } from "./index";

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

function readLangFromUrl(): Lang | null {
  const href = window.location.href;
  const url = new URL(href);

  const qLang = url.searchParams.get("lang");
  if (qLang === "no" || qLang === "en") return qLang;

  if (url.hash && url.hash.includes("?")) {
    const idx = url.hash.indexOf("?");
    const qs = url.hash.slice(idx + 1);
    const sp = new URLSearchParams(qs);
    const hLang = sp.get("lang");
    if (hLang === "no" || hLang === "en") return hLang;
  }

  return null;
}

export const I18nProvider: React.FC<Props> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const fromUrl = readLangFromUrl();
    if (fromUrl) {
      setLangState(fromUrl);
      localStorage.setItem(LANG_STORAGE_KEY, fromUrl);
      return;
    }

    const initial = getInitialLang();
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "no" ? "no" : "en";
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[lang];
    return {
      lang,
      setLang: setLangState,
      t: createT(dict),
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
