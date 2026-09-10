import { Heart, Home, Building2, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import CoverageAccordion from "@/components/ui/coverage-accordion";
import RequestInfoButton from "@/components/ui/request-info-button";
import ConsultationModalProvider from "@/components/ui/consultation-modal-provider";
import { lifeInsuranceApplyUrl } from "@/lib/site-config";

const cardClass =
  "group relative flex min-h-[320px] flex-col overflow-hidden border border-gray-200 bg-white p-6 shadow-[0_0_0_rgba(0,0,0,0)] transition-shadow hover:shadow-[0_15px_35px_rgba(15,28,46,0.11)]";

const cardHover = { y: -5, transition: { duration: 0.2 } };

const iconWrapClass =
  "grid h-[55px] w-[55px] place-items-center rounded-full bg-[#fff3e8] text-brand";

const accentBar = (
  <span
    aria-hidden="true"
    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-dark transition-transform duration-300 group-hover:scale-x-100"
  />
);

export default function ServicesSection() {
  return (
    <ConsultationModalProvider>
      <section id="services" className="scroll-mt-[100px] bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-10">
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

          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal
              delay={0.05}
              className={cardClass}
              as="article"
              whileHover={cardHover}
            >
              {accentBar}
              <div className="flex items-start justify-between">
                <div className={iconWrapClass}>
                  <Heart size={26} />
                </div>
                <span className="text-sm font-semibold text-gray-200 transition-colors group-hover:text-brand/30">
                  01
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-navy">Life</h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                Life coverage and fixed annuity options to help protect loved
                ones and support long-term financial goals.
              </p>
              <a
                href={lifeInsuranceApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                Apply for life insurance <ArrowRight size={13} />
              </a>
            </Reveal>

            <Reveal
              delay={0.15}
              className={cardClass}
              as="article"
              whileHover={cardHover}
            >
              {accentBar}
              <div className="flex items-start justify-between">
                <div className={iconWrapClass}>
                  <Home size={26} />
                </div>
                <span className="text-sm font-semibold text-gray-200 transition-colors group-hover:text-brand/30">
                  02
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-navy">
                Personal Lines
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Coverage options designed to help protect you, your family
                and the personal property you value.
              </p>
              <CoverageAccordion />
            </Reveal>

            <Reveal
              delay={0.25}
              className={cardClass}
              as="article"
              whileHover={cardHover}
            >
              {accentBar}
              <div className="flex items-start justify-between">
                <div className={iconWrapClass}>
                  <Building2 size={26} />
                </div>
                <span className="text-sm font-semibold text-gray-200 transition-colors group-hover:text-brand/30">
                  03
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-navy">
                Commercial Lines
              </h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                Comprehensive commercial insurance solutions designed to
                protect your business, assets, employees, and operations.
              </p>
              <RequestInfoButton
                service="Commercial Lines"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                Request information <ArrowRight size={13} />
              </RequestInfoButton>
            </Reveal>
          </div>
        </div>
      </section>
    </ConsultationModalProvider>
  );
}
