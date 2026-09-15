"use client";

import { createElement } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import RequestInfoButton from "@/components/ui/request-info-button";
import ServiceAccordion from "@/components/ui/service-accordion";
import { getServiceIcon } from "@/lib/service-icons";
import { fadeUp, viewportOnce } from "@/lib/motion";

const cardClass =
  "group relative flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,28,46,0.04)] transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(15,28,46,0.22)]";

const iconWrapClass =
  "relative grid h-[55px] w-[55px] place-items-center rounded-full bg-[#fff3e8] text-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6";

export default function ServiceCard({ service, index, delay }) {
  const icon = createElement(getServiceIcon(service.icon), { size: 26 });

  return (
    <motion.div
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
          <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
            {service.description}
          </p>

          {service.ctaType === "apply" && service.ctaHref && (
            <a
              href={service.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              {service.ctaLabel || "Learn more"}{" "}
              <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-1" />
            </a>
          )}

          {service.ctaType === "info" && (
            <RequestInfoButton
              service={service.title}
              className="group/link mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              {service.ctaLabel || "Request information"}{" "}
              <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-1" />
            </RequestInfoButton>
          )}

          {service.ctaType === "accordion" && service.accordionItems.length > 0 && (
            <ServiceAccordion
              items={service.accordionItems}
              servicePrefix={service.title}
              triggerLabel={service.ctaLabel || "View coverage options"}
            />
          )}
        </div>
      </Tilt>
    </motion.div>
  );
}
