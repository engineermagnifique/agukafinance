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

export default async function ServicesSection() {
  const services = await listActiveServices();

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
              Insurance, Tax &amp; Mortgage Support
            </h2>
          </Reveal>

          <div className="relative mx-auto mt-16 max-w-5xl">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gray-300 to-transparent md:block"
            />
            <div className="flex flex-col gap-10 md:gap-16">
              {services.map((service, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={service.id}
                    className="relative md:grid md:grid-cols-2 md:items-center md:gap-x-12"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 z-10 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-brand bg-cream md:block"
                    />
                    <div className={isLeft ? "md:pr-14" : "md:col-start-2 md:pl-14"}>
                      <ServiceCard
                        service={service}
                        index={index}
                        delay={0.05 + index * 0.1}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </ConsultationModalProvider>
  );
}
