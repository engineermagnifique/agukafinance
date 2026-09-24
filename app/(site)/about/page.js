import Link from "next/link";
import { ShieldCheck, Handshake, Award, Wallet, ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import TrustBand from "@/components/sections/trust-band";
import { values } from "@/lib/site-config";
import { getDictionary } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const { locale, t } = await getDictionary();
  return pageMetadata({
    title: t.meta.aboutTitle,
    description: t.meta.aboutDescription,
    path: "/about",
    locale,
  });
}

const valueIcons = {
  Integrity: ShieldCheck,
  Transparency: Handshake,
  Professionalism: Award,
  Affordability: Wallet,
};

export default async function AboutPage() {
  const { t } = await getDictionary();

  return (
    <>
      <PageHero
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        subtitle={t.meta.tagline}
        breadcrumb={[{ label: t.nav.home, href: "/" }, { label: t.about.breadcrumb }]}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20 lg:px-10">
          <Reveal>
            <Eyebrow align="center">{t.about.sectionEyebrow}</Eyebrow>
            <h2 className="mt-3 text-[clamp(20px,2.6vw,28px)] font-bold leading-[1.2] text-navy">
              {t.about.heading}
            </h2>
            <p className="mx-auto mt-4 leading-relaxed text-muted">{t.about.intro}</p>
          </Reveal>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-2 sm:pb-20 lg:px-10">
          <Reveal
            delay={0.05}
            className="rounded-xl border border-gray-100 bg-white p-7 text-center sm:text-left"
          >
            <Eyebrow align="center">{t.about.visionLabel}</Eyebrow>
            <p className="mt-3 leading-relaxed text-ink">{t.about.vision}</p>
          </Reveal>
          <Reveal
            delay={0.1}
            className="rounded-xl border border-gray-100 bg-white p-7 text-center sm:text-left"
          >
            <Eyebrow align="center">{t.about.missionLabel}</Eyebrow>
            <p className="mt-3 leading-relaxed text-ink">{t.about.mission}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow align="center">{t.about.mottoLabel}</Eyebrow>
            <h2 className="mt-3 text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.2] text-navy">
              {t.about.motto}
            </h2>
          </Reveal>

          <p className="mt-10 text-center text-[12px] font-semibold uppercase tracking-widest text-muted">
            {t.about.coreValues}
          </p>

          <div className="mx-auto mt-4 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = valueIcons[value] || ShieldCheck;
              return (
                <Reveal
                  key={value}
                  delay={0.05 + index * 0.08}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-cream px-4 py-8 text-center"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#fff3e8] text-brand">
                    <Icon size={24} />
                  </span>
                  <p className="text-sm font-semibold text-navy">{t.about.values[value] || value}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <TrustBand />

      <section className="bg-cream">
        <Reveal
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-16 text-center sm:py-20 lg:px-10"
        >
          <h2 className="text-[clamp(24px,3.2vw,32px)] font-bold leading-[1.2] text-navy">
            {t.about.pledgeTitle}
          </h2>
          <p className="max-w-2xl leading-relaxed text-muted">{t.about.pledge}</p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-brand to-brand-dark py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            {t.common.contactUs}
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={16} />
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
