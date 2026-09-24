"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

const LanguageContext = createContext({ locale: DEFAULT_LOCALE, t: null });

// The root layout reads the language cookie on the server and passes only the
// active dictionary down, so client bundles don't carry the translations.
export default function LanguageProvider({ locale, dictionary, children }) {
  return (
    <LanguageContext.Provider value={{ locale, t: dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  return useContext(LanguageContext);
}
