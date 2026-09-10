import Logo from "@/components/layout/logo";
import { siteConfig } from "@/lib/site-config";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep text-white/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.2fr_1.4fr] lg:px-10 lg:py-20">
        <div className="flex flex-col items-start gap-4">
          <Logo size="footer" />
          <p className="max-w-xs text-[13px] leading-relaxed text-white/50">
            Building and protecting what matters most through honest
            guidance and personal service.
          </p>
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
            {siteConfig.license.agent}
          </p>
          <p className="leading-relaxed text-white/50">
            {siteConfig.license.broker}
          </p>
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
              are subject to lender guidelines and approval.
            </p>
          </div>
          <p className="whitespace-nowrap text-[9px] text-white/40">
            © {year} AGUKA Financial Group.
          </p>
        </div>
      </div>
    </footer>
  );
}
