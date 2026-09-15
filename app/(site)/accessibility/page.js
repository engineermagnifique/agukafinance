import Eyebrow from "@/components/ui/eyebrow";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Accessibility Statement",
  description: `${siteConfig.name}'s commitment to a website usable by everyone.`,
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-10">
        <Eyebrow>LEGAL</Eyebrow>
        <h1 className="mt-3 text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] text-navy">
          Accessibility Statement
        </h1>
        <p className="mt-2 text-xs text-muted">Last updated: January 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink">
          <p>
            {siteConfig.name} is committed to making {siteConfig.url} usable
            by everyone, including people with disabilities, in line with the
            Americans with Disabilities Act (ADA) and the Web Content
            Accessibility Guidelines (WCAG) 2.1, Level AA.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-navy">Our Approach</h2>
            <p className="mt-2">
              We aim to provide clear navigation, readable text and color
              contrast, keyboard-accessible controls, and descriptive labels
              for interactive elements such as forms and buttons.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Ongoing Work</h2>
            <p className="mt-2">
              Accessibility is an ongoing effort. As we add or update
              features, we review them for usability across assistive
              technologies, including screen readers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy">Feedback</h2>
            <p className="mt-2">
              If you encounter a barrier using this site, please let us know
              so we can address it. Contact us at{" "}
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
