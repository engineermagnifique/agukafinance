import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import ServiceCard from "@/components/ui/service-card";
import ConsultationModalProvider from "@/components/ui/consultation-modal-provider";
import ParallaxDecor from "@/components/ui/parallax-decor";
import FloatingCircles from "@/components/ui/floating-circles";
import ScrollTintOverlay from "@/components/ui/scroll-tint-overlay";
import { listActiveServices, localizeService } from "@/lib/services";
import { getDictionary } from "@/lib/i18n/server";

function chunk(items, size) {
  const groups = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
}

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
  const [{ locale, t }, activeServices] = await Promise.all([getDictionary(), listActiveServices()]);
  const services = activeServices.map((service) => localizeService(service, locale));

  return (
    <ConsultationModalProvider>
      <section id="services" className="relative scroll-mt-[100px] overflow-hidden bg-cream">
        <ScrollTintOverlay />
        <ParallaxDecor blobs={decorBlobs} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden">
          <FloatingCircles />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow align="center">{t.servicesSection.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-[clamp(30px,4vw,49px)] font-bold leading-[1.13] text-navy">
              {t.servicesSection.title}
            </h2>
          </Reveal>

          <div className="relative mx-auto mt-16 max-w-6xl">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gray-300 to-transparent md:block"
            />
            <div className="flex flex-col gap-8 md:gap-12">
              {chunk(services, 2).map((pair, rowIndex) => (
                <div
                  key={pair[0].id}
                  className="relative grid gap-6 md:grid-cols-2 md:items-center md:gap-x-10"
                >
                  {pair.length === 2 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 z-10 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-brand bg-cream md:block"
                    />
                  )}
                  {pair.length === 1 ? (
                    <div className="md:col-span-2 md:mx-auto md:w-1/2 md:pr-8">
                      <ServiceCard
                        service={pair[0]}
                        index={rowIndex * 2}
                        delay={0.05 + rowIndex * 2 * 0.1}
                      />
                    </div>
                  ) : (
                    pair.map((service, columnIndex) => {
                      const index = rowIndex * 2 + columnIndex;
                      return (
                        <div
                          key={service.id}
                          className={columnIndex === 0 ? "md:pr-8" : "md:pl-8"}
                        >
                          <ServiceCard
                            service={service}
                            index={index}
                            delay={0.05 + index * 0.1}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ConsultationModalProvider>
  );
}
