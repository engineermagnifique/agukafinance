import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import ServiceCard from "@/components/ui/service-card";
import ConsultationModalProvider from "@/components/ui/consultation-modal-provider";
import ParallaxDecor from "@/components/ui/parallax-decor";
import FloatingCircles from "@/components/ui/floating-circles";
import ScrollTintOverlay from "@/components/ui/scroll-tint-overlay";
import { listActiveServices } from "@/lib/services";

const decorBlobs = [
  {
    range: [-40, 60],
    className:
      "absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl",
  },
  {
    range: [40, -60],
    className:
      "absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-navy/10 blur-3xl",
  },
];

export default function ServicesSection() {
  const services = listActiveServices();

  return (
    <ConsultationModalProvider>
      <section id="services" className="relative scroll-mt-[100px] overflow-hidden bg-cream">
        <ScrollTintOverlay />
        <ParallaxDecor blobs={decorBlobs} />
        <FloatingCircles />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow align="center">HOW WE CAN HELP</Eyebrow>
            <h2 className="mt-3 text-[clamp(30px,4vw,49px)] font-bold leading-[1.13] text-navy">
              Financial solutions for every stage of life
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              One trusted place to protect what you have, plan what comes
              next and move forward with confidence.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-4">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="grow shrink basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.667rem)]"
              >
                <ServiceCard service={service} index={index} delay={0.05 + index * 0.1} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </ConsultationModalProvider>
  );
}
