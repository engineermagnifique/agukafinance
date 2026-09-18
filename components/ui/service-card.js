"use client";

import { createElement, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Modal from "@/components/ui/modal";
import RequestInfoButton from "@/components/ui/request-info-button";
import ServiceAccordion from "@/components/ui/service-accordion";
import { getServiceIcon } from "@/lib/service-icons";
import { fadeUp, viewportOnce } from "@/lib/motion";

const cardClass =
  "group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,28,46,0.04)] transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(15,28,46,0.22)]";

const iconWrapClass =
  "relative grid h-[55px] w-[55px] place-items-center rounded-full bg-[#fff3e8] text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6";

function ServiceCta({ service }) {
  if (service.ctaType === "apply" && service.ctaHref) {
    return (
      <a
        href={service.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
      >
        {service.ctaLabel || "Learn more"}{" "}
        <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-1" />
      </a>
    );
  }

  if (service.ctaType === "info") {
    return (
      <RequestInfoButton
        service={service.title}
        className="group/link mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
      >
        {service.ctaLabel || "Request information"}{" "}
        <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-1" />
      </RequestInfoButton>
    );
  }

  return null;
}

export default function ServiceCard({ service, index, delay }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const Icon = getServiceIcon(service.icon);
  const icon = createElement(Icon, { size: 26 });
  const hasStandaloneCta = service.ctaType === "apply" || service.ctaType === "info";

  return (
    <motion.div
      className="h-full"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      custom={delay}
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        perspective={900}
        scale={1.02}
        transitionSpeed={1000}
        glareEnable
        glareMaxOpacity={0.18}
        glareColor="#f07d1a"
        glarePosition="all"
        glareBorderRadius="12px"
        className={cardClass}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-dark transition-transform duration-300 group-hover:scale-x-100"
        />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-start justify-between">
            <div className={iconWrapClass}>{icon}</div>
            <span className="text-sm font-semibold text-gray-200 transition-colors group-hover:text-brand/30">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-5 text-xl font-semibold text-navy">{service.title}</h3>
          <p className="mt-2 line-clamp-6 flex-1 text-[13px] leading-relaxed text-muted">
            {service.description}
          </p>

          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="mt-3 inline-flex w-fit items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-navy/50 transition-colors hover:text-brand"
          >
            View more
            <ArrowRight size={11} />
          </button>

          <ServiceCta service={service} />

          {service.ctaType === "accordion" && service.accordionItems.length > 0 && (
            <ServiceAccordion
              items={service.accordionItems}
              servicePrefix={service.title}
              triggerLabel={service.ctaLabel || "View coverage options"}
            />
          )}
        </div>
      </Tilt>

      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title={service.title}>
        <div className="rounded-sm border-t-4 border-brand bg-white p-6 shadow-2xl sm:p-8">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#fff3e8] text-brand">
            {createElement(Icon, { size: 28 })}
          </div>
          <h3 className="mt-5 text-2xl font-bold text-navy">{service.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>

          {service.ctaType === "accordion" && service.accordionItems.length > 0 && (
            <ul className="mt-5 grid grid-cols-1 gap-2.5 border-t border-gray-100 pt-5 sm:grid-cols-2">
              {service.accordionItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink">
                  <Check size={14} className="shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {hasStandaloneCta && (
            <div
              className="mt-6 border-t border-gray-100 pt-5"
              onClick={() => setDetailsOpen(false)}
            >
              <ServiceCta service={service} />
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}
