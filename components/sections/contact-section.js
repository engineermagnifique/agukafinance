import { Suspense } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import ConsultationForm from "@/components/ui/consultation-form";
import ParallaxDecor from "@/components/ui/parallax-decor";
import FlowingGlow from "@/components/ui/flowing-glow";
import { siteConfig } from "@/lib/site-config";

const decorBlobs = [
  {
    range: [-30, 50],
    className:
      "absolute left-1/3 top-0 h-72 w-72 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl",
  },
];

const contactItems = [
  {
    icon: Phone,
    label: "Call us",
    value: siteConfig.phone,
    href: siteConfig.phoneHref,
  },
  {
    icon: Mail,
    label: "Email us",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-[100px] overflow-hidden bg-gradient-to-tr from-brand-dark/[0.12] via-cream to-cream"
    >
      <FlowingGlow />
      <ParallaxDecor blobs={decorBlobs} />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 sm:py-24 lg:grid-cols-[1fr_1.15fr] lg:gap-[8vw] lg:px-10">
        <Reveal>
          <Eyebrow>LET&rsquo;S CONNECT</Eyebrow>
          <h2 className="mt-3 text-[clamp(30px,4vw,49px)] font-bold leading-[1.13] text-navy">
            Start with a simple conversation
          </h2>
          <p className="mt-3 max-w-md leading-relaxed text-muted">
            Tell us what you&rsquo;re working toward. We&rsquo;ll listen,
            answer your questions and help identify a practical next step.
          </p>

          <dl className="mt-8 space-y-6">
            {contactItems.map((item, index) => (
              <Reveal
                key={item.label}
                delay={0.1 + index * 0.08}
                whileHover={{ x: 4 }}
                className="group flex items-start gap-3.5"
              >
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff3e8] text-brand shadow-[0_0_0_0_rgba(240,125,26,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_0_0_6px_rgba(240,125,26,0.15)]">
                  <item.icon size={16} />
                </span>
                <div>
                  <dt className="text-[11px] text-gray-400">{item.label}</dt>
                  {item.href ? (
                    <dd className="font-semibold leading-relaxed text-navy">
                      <a href={item.href} className="hover:text-brand">
                        {item.value}
                      </a>
                    </dd>
                  ) : (
                    <dd className="font-semibold leading-relaxed text-navy">
                      {item.value}
                    </dd>
                  )}
                </div>
              </Reveal>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.15}>
          <Suspense fallback={<FormFallback />}>
            <ConsultationForm />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
}

function FormFallback() {
  return (
    <div className="h-[560px] animate-pulse border-t-4 border-brand/60 bg-white shadow-[0_16px_40px_rgba(15,28,46,0.1)]" />
  );
}
