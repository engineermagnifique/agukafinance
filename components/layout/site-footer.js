import { Facebook, Instagram, Linkedin, Home as HomeIcon } from "lucide-react";
import Logo from "@/components/layout/logo";
import { siteConfig, socialLinks } from "@/lib/site-config";

const socialIcons = { Facebook, Instagram, Linkedin };

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Accessibility Statement", href: "/accessibility" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep text-white/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr_1.4fr] lg:px-10 lg:py-20">
        <div className="flex flex-col items-start gap-4">
          <Logo size="footer" />
          <p className="max-w-xs text-[13px] leading-relaxed text-white/50">
            {siteConfig.tagline}.
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
            Quick Links
          </h4>
          <a href="#services" className="text-white/50 hover:text-brand">
            Our Services
          </a>
          <a href="#contact" className="text-white/50 hover:text-brand">
            Contact Us
          </a>
        </div>

        <div className="flex flex-col gap-3 text-[12px]">
          <h4 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
            Legal
          </h4>
          {legalLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-white/50 hover:text-brand">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-[12px]">
          <h4 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
            Contact
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
          <p className="text-white/50">Irving, Texas</p>
        </div>

        <div className="flex flex-col gap-3 text-[12px]">
          <h4 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
            License Information
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
            NMLS Consumer Access
          </a>
          <span className="mt-1 inline-flex items-center gap-1.5 text-white/50">
            <HomeIcon size={13} className="shrink-0" />
            Equal Housing Opportunity
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl space-y-2 text-[9px] leading-relaxed text-white/40">
            <p>
              Insurance products and availability vary by state and carrier.
              Coverage is subject to underwriting, policy terms, conditions
              and exclusions. Tax services do not constitute legal advice.
              AGUKA Financial Group is neither a carrier nor a bank or
              lender.
            </p>
            <p>
              <b className="text-white/60">Mortgage disclosure:</b> Mortgage
              services are provided by a licensed mortgage loan originator
              through an approved mortgage broker firm. The third-party rate
              link opens a separate website. Programs, rates and eligibility
              are subject to lender guidelines and approval. AGUKA Financial
              Group supports the Equal Credit Opportunity Act and the Fair
              Housing Act.
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 lg:items-end">
            <p className="whitespace-nowrap text-[9px] text-white/40">
              © {year} AGUKA Financial Group.
            </p>
            <p className="whitespace-nowrap text-[9px] text-white/30">
              Powered by Magnifique N
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
