import Eyebrow from "@/components/ui/eyebrow";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${siteConfig.name}'s website.`,
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-10">
        <Eyebrow>LEGAL</Eyebrow>
        <h1 className="mt-3 text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] text-navy">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-muted">Last updated: January 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink">
          <p>
            These Terms of Service govern your use of {siteConfig.url}. By
            using this site, you agree to these terms. If you do not agree,
            please do not use the site.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-navy">No Professional Advice</h2>
            <p className="mt-2">
              Content on this site is provided for general informational
              purposes only and does not constitute insurance, financial,
              tax or legal advice. Submitting a form does not create a
              client relationship or guarantee eligibility, coverage, rates
              or tax outcomes. Insurance and mortgage products are subject to
              underwriting, carrier and lender approval.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Use of This Site</h2>
            <p className="mt-2">
              You agree to use this site only for lawful purposes and not to
              interfere with its operation, attempt unauthorized access, or
              submit false information through our forms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Intellectual Property</h2>
            <p className="mt-2">
              The content, logo and design of this site are owned by{" "}
              {siteConfig.name} and may not be reproduced without permission.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Third-Party Links</h2>
            <p className="mt-2">
              This site may link to third-party websites (such as a life
              insurance carrier&rsquo;s application portal). We are not
              responsible for the content or practices of those sites.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Limitation of Liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, {siteConfig.name} is
              not liable for any indirect or consequential damages arising
              from your use of this site.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Governing Law</h2>
            <p className="mt-2">
              These terms are governed by the laws of the State of Texas,
              without regard to conflict-of-law principles.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Contact Us</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-brand hover:text-brand-dark">
                {siteConfig.email}
              </a>{" "}
              or {siteConfig.phone}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
