import Link from "next/link";
import Eyebrow from "@/components/ui/eyebrow";
import { verifyUnsubscribeToken } from "@/lib/newsletter";
import { getDictionary } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/config";
import { unsubscribeAction } from "./actions";

export async function generateMetadata() {
  const { t } = await getDictionary();
  return {
    title: t.meta.unsubscribeTitle,
    robots: { index: false, follow: false },
  };
}

// Unsubscribing takes a button press rather than happening on page load, so
// email link scanners that pre-open links can't remove people by accident.
export default async function UnsubscribePage({ searchParams }) {
  const { t } = await getDictionary();
  const params = await searchParams;
  const email = typeof params?.email === "string" ? params.email : "";
  const token = typeof params?.token === "string" ? params.token : "";
  const status = params?.status;

  const validLink = email && token && verifyUnsubscribeToken(email, token);

  let content;
  if (status === "done") {
    content = <p className="mt-4 leading-relaxed text-ink">{t.unsubscribe.success}</p>;
  } else if (status === "invalid" || !validLink) {
    content = <p className="mt-4 leading-relaxed text-ink">{t.unsubscribe.invalid}</p>;
  } else {
    content = (
      <form action={unsubscribeAction} className="mt-4 flex flex-col items-start gap-5">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={token} />
        <p className="leading-relaxed text-ink">{format(t.unsubscribe.intro, { email })}</p>
        <button
          type="submit"
          className="rounded-[3px] bg-gradient-to-br from-brand to-brand-dark px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t.unsubscribe.button}
        </button>
      </form>
    );
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24 lg:px-10">
        <Eyebrow>{t.unsubscribe.eyebrow}</Eyebrow>
        <h1 className="mt-3 text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.15] text-navy">
          {t.unsubscribe.title}
        </h1>
        {content}
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
        >
          {t.unsubscribe.backHome}
        </Link>
      </div>
    </section>
  );
}
