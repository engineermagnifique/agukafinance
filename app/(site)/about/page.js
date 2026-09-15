import Link from "next/link";
import { ShieldCheck, Handshake, Award, HeartHandshake, ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import TrustBand from "@/components/sections/trust-band";
import { siteConfig, values } from "@/lib/site-config";

export const metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} and the values behind our insurance, mortgage and tax services support.`,
  alternates: { canonical: "/about" },
};

const valueIcons = {
  Integrity: ShieldCheck,
  Transparency: Handshake,
  Professionalism: Award,
  "Heart of Service": HeartHandshake,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title={`About ${siteConfig.shortName}`}
        subtitle={siteConfig.tagline}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20 lg:px-10">
          <Reveal>
            <Eyebrow align="center">OUR MISSION</Eyebrow>
            <h2 className="mt-3 text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.2] text-navy">
              Honest guidance, without the sales pressure
            </h2>
            <p className="mx-auto mt-4 leading-relaxed text-muted">
              {siteConfig.description} Whether you are protecting your family,
              buying a home, or planning ahead for tax season, we take the
              time to explain your options clearly so you can make decisions
              with confidence.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow align="center">WHAT WE STAND FOR</Eyebrow>
            <h2 className="mt-3 text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.2] text-navy">
              Our values
            </h2>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <p className="text-sm font-semibold text-navy">{value}</p>
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
            Ready to talk through your options?
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted">
            Reach out for a free, no-pressure consultation with our team.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-brand to-brand-dark py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Contact Us
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={16} />
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
