import en from "@/lib/i18n/dictionaries/en";
import rw from "@/lib/i18n/dictionaries/rw";
import { normalizeLocale } from "@/lib/i18n/config";

const dictionaries = { en, rw };

export function getDictionaryFor(locale) {
  return dictionaries[normalizeLocale(locale)];
}
