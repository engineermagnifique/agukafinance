import { cookies } from "next/headers";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/config";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";

// The visitor's language lives in a cookie (set by the navbar switcher), so
// URLs stay the same in both languages.
export async function getLocale() {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: getDictionaryFor(locale) };
}

// For route handlers, which receive the request directly.
export function getRequestLocale(request) {
  return normalizeLocale(request.cookies.get(LOCALE_COOKIE)?.value);
}
