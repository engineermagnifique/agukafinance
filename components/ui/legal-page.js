import Eyebrow from "@/components/ui/eyebrow";
import { siteConfig } from "@/lib/site-config";
import { format } from "@/lib/i18n/config";

// Renders a legal page (privacy, terms, accessibility) from its dictionary
// section: { title, intro, sections: [{ heading, paragraphs }], contact }.
export default function LegalPage({ t, content, contactHeading }) {
  const vars = { name: siteConfig.name, url: siteConfig.url };

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-10">
        <Eyebrow>{t.legal.eyebrow}</Eyebrow>
        <h1 className="mt-3 text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] text-navy">
          {content.title}
        </h1>
        <p className="mt-2 text-xs text-muted">{t.legal.lastUpdated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink">
          <p>{format(content.intro, vars)}</p>

          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-navy">{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "mt-2" : "mt-3"}>
                  {format(paragraph, vars)}
                </p>
              ))}
            </div>
          ))}

          <div>
            <h2 className="text-lg font-semibold text-navy">
              {contactHeading || t.legal.contactHeading}
            </h2>
            <p className="mt-2">
              {content.contact}{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-brand hover:text-brand-dark">
                {siteConfig.email}
              </a>{" "}
              {t.legal.or} {siteConfig.phone}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
