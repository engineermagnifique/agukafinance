"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useI18n } from "@/components/i18n/language-provider";
import { LOCALES, format, localeNames } from "@/lib/i18n/config";
import { saveLocale } from "@/lib/i18n/client";

const shortNames = { en: "EN", rw: "RW" };

export default function LanguageSwitcher({ tone = "light", className = "" }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function choose(next) {
    if (next === locale) return;
    saveLocale(next);
    // Re-render the server components with the new cookie; client state
    // (scroll position, open modals) is preserved.
    startTransition(() => router.refresh());
  }

  const isDark = tone === "dark";

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={`inline-flex items-center gap-1 rounded-full p-1 text-[12px] font-bold transition-opacity ${
        isDark ? "bg-white/10" : "bg-navy/5"
      } ${isPending ? "opacity-60" : ""} ${className}`}
    >
      <Globe
        size={14}
        aria-hidden="true"
        className={`ml-1.5 mr-0.5 shrink-0 ${isDark ? "text-gold" : "text-brand"}`}
      />
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => choose(code)}
            aria-pressed={active}
            aria-label={format(t.language.switchTo, { language: localeNames[code] })}
            title={localeNames[code]}
            disabled={isPending}
            className={`rounded-full px-2.5 py-1 tracking-wide transition-colors ${
              active
                ? "bg-brand text-white shadow-sm"
                : isDark
                  ? "text-white/70 hover:text-white"
                  : "text-navy/60 hover:text-navy"
            }`}
          >
            {shortNames[code]}
          </button>
        );
      })}
    </div>
  );
}
