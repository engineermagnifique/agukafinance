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
            <h2 className="text-lg font-semibold text-navy">Company Disclaimer</h2>
            <p className="mt-2">
              {siteConfig.name} is an independent insurance and financial
              services support limited liability company. AGUKA is not a
              bank, lender, depository financial institution, mortgage
              broker, or insurance carrier. AGUKA does not directly fund
              loans, make credit decisions, underwrite insurance, issue
              insurance policies, or pay insurance claims.
            </p>
            <p className="mt-3">
              Mortgage loan origination services are provided by a licensed
              mortgage loan originator through and under the supervision of
              an approved sponsoring mortgage broker or lender. All mortgage
              applications, products, interest rates, terms, disclosures,
              underwriting decisions, approvals, and closing services are
              provided or managed through the sponsoring mortgage company and
              applicable third parties. Submitting an inquiry or application
              does not guarantee loan approval or constitute a commitment to
              lend. Loan programs, rates, terms, and eligibility requirements
              are subject to change and depend on the applicant&rsquo;s
              qualifications and applicable underwriting guidelines.
            </p>
            <p className="mt-3">
              Insurance services are provided through appropriately licensed
              insurance producers and authorized insurance carriers. AGUKA
              may assist clients with exploring coverage options and
              completing applications but does not make final underwriting
              decisions, determine premiums, guarantee coverage, issue
              policies, or pay claims. Insurance products and availability
              vary by state and carrier. All coverage is subject to
              underwriting, policy terms, conditions, limitations, and
              exclusions. Coverage is not effective or bound until confirmed
              in writing by the applicable insurance carrier or its
              authorized representative.
            </p>
            <p className="mt-3">
              AFG does not provide advice or recommendations regarding
              securities, stocks, mutual funds, or other investment products
              unless a separate client relationship has been established
              with a properly licensed investment adviser and all required
              disclosures have been provided. Any such investment advisory
              services are offered solely through the applicable licensed
              entity and are subject to separate agreements and regulatory
              requirements.
            </p>
            <p className="mt-3">
              Services are offered only where properly licensed and
              authorized. Information provided by AGUKA is for general
              educational and informational purposes and should not be
              considered a guarantee of financing, insurance coverage,
              rates, premiums, benefits, or financial results.
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
