// Shared by server and client code — keep this file free of server-only imports.
export const LOCALES = ["en", "rw"];
export const DEFAULT_LOCALE = "en";

// Temporarily off: hides the navbar language switcher and serves every visitor
// DEFAULT_LOCALE, ignoring any saved language cookie. Set to true to re-enable.
export const LANGUAGE_SWITCHING_ENABLED = false;
export const LOCALE_COOKIE = "aguka_lang";
export const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export const localeNames = {
  en: "English",
  rw: "Kinyarwanda",
};

// Used for Intl date formatting. Browsers/Node rarely ship "rw" date data,
// so formatting falls back gracefully to English month names.
export const intlLocales = {
  en: "en-US",
  rw: "rw-RW",
};

export function isLocale(value) {
  return LOCALES.includes(value);
}

export function normalizeLocale(value) {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

// Replaces {placeholders} in a dictionary string, e.g.
// format("Call {phone}", { phone: "555" }) -> "Call 555".
export function format(template, values = {}) {
  return String(template ?? "").replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match
  );
}
