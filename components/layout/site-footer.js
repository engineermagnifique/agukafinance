import { Facebook, Instagram, Linkedin, Home as HomeIcon } from "lucide-react";
import Logo from "@/components/layout/logo";
import { siteConfig, socialLinks } from "@/lib/site-config";
import { getDictionary } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/config";

const socialIcons = { Facebook, Instagram, Linkedin };

const legalLinks = [
  { key: "privacy", href: "/privacy-policy" },
  { key: "terms", href: "/terms-of-service" },
  { key: "accessibility", href: "/accessibility" },
];

export default async function SiteFooter() {
  const { t } = await getDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep text-white/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr_1.4fr] lg:px-10 lg:py-20">
        <div className="flex flex-col items-start gap-4">
          <Logo size="footer" />
          <p className="max-w-xs text-[13px] leading-relaxed text-white/50">
            {t.meta.tagline}.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-brand hover:text-white"
                >
                  {Icon && <Icon size={15} />}
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-[12px]">
          <h4 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
            {t.footer.quickLinks}
          </h4>
          <a href="#services" className="text-white/50 hover:text-brand">
            {t.footer.ourServices}
          </a>
          <a href="#contact" className="text-white/50 hover:text-brand">
            {t.footer.contactUs}
          </a>
        </div>

        <div className="flex flex-col gap-3 text-[12px]">
          <h4 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
            {t.footer.legal}
          </h4>
          {legalLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-white/50 hover:text-brand">
              {t.footer[link.key]}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-[12px]">
          <h4 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
            {t.footer.contact}
          </h4>
          <a href={siteConfig.phoneHref} className="text-white/50 hover:text-brand">
            {siteConfig.phone}
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-white/50 hover:text-brand"
          >
            {siteConfig.email}
          </a>
          <p className="text-white/50">{t.footer.city}</p>
        </div>

        <div className="flex flex-col gap-3 text-[12px]">
          <h4 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
            {t.footer.license}
          </h4>
          <p className="leading-relaxed text-white/50">
            NPN: {siteConfig.license.npn}
          </p>
          <p className="leading-relaxed text-white/50">
            PTIN: {siteConfig.license.ptin}
          </p>
          <p className="leading-relaxed text-white/50">
            {siteConfig.license.agent}
          </p>
          <p className="leading-relaxed text-white/50">
            {siteConfig.license.broker}
          </p>
          <a
            href="https://www.nmlsconsumeraccess.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-brand"
          >
            {t.footer.nmls}
          </a>
          <span className="mt-1 inline-flex items-center gap-1.5 text-white/50">
            <HomeIcon size={13} className="shrink-0" />
            {t.footer.equalHousing}
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl space-y-2 text-[9px] leading-relaxed text-white/40">
            <p>{t.footer.disclaimer}</p>
            <p>
              <b className="text-white/60">{t.footer.mortgageLabel}</b>{" "}
              {t.footer.mortgageDisclosure}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 lg:items-end">
            <p className="whitespace-nowrap text-[9px] text-white/40">
              {format(t.footer.copyright, { year })}
            </p>
            <p className="whitespace-nowrap text-[9px] text-white/30">
              {t.footer.poweredBy}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
