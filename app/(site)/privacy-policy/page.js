import Eyebrow from "@/components/ui/eyebrow";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your information.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-10">
        <Eyebrow>LEGAL</Eyebrow>
        <h1 className="mt-3 text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] text-navy">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-muted">Last updated: January 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink">
          <p>
            {siteConfig.name} (&ldquo;AGUKA,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;
            or &ldquo;our&rdquo;) respects your privacy. This policy explains what
            information we collect through {siteConfig.url}, how we use it, and
            the choices available to you.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-navy">Information We Collect</h2>
            <p className="mt-2">
              When you submit a consultation request or subscribe to our
              newsletter, we collect the information you provide, such as your
              name, email address, phone number, and the service you are
              interested in. We also automatically collect limited technical
              information (such as page visited and referring URL) to help us
              understand how our site is used, subject to your cookie
              preferences.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">How We Use Your Information</h2>
            <p className="mt-2">
              We use the information we collect to respond to your requests,
              provide the insurance, mortgage and tax services support you ask
              about, send newsletter updates you opt into, and improve our
              website. We do not sell your personal information.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Cookies</h2>
            <p className="mt-2">
              We use cookies to support basic site functionality and, with your
              consent, to understand site traffic. You can accept or reject
              non-essential cookies at any time using the cookie banner
              displayed on your first visit.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Third Parties</h2>
            <p className="mt-2">
              Some requests (for example, life insurance applications or
              mortgage rate lookups) are completed on a third-party
              partner&rsquo;s website. Those sites have their own privacy practices, which we
              encourage you to review.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Your Choices</h2>
            <p className="mt-2">
              You may ask us to update or delete the information we hold about
              you, or unsubscribe from newsletter emails at any time, by
              contacting us using the details below.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Contact Us</h2>
            <p className="mt-2">
              Questions about this policy can be sent to{" "}
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
