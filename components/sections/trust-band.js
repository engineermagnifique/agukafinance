"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";
import dayImage from "@/public/images/hero-daylight.png";
import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";

export default function TrustBand() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.3]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-navy py-20 text-white sm:py-28"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={dayImage}
          alt="A family smiling together in front of their home and cars in the driveway"
          fill
          sizes="100vw"
          className="object-cover object-[75%_center]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40 sm:bg-[linear-gradient(90deg,#011f48f2_0%,#011f48d0_45%,#011f48a6_75%,#011f4873_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <Eyebrow>MESSAGE OF THE MONTH</Eyebrow>

          <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-7 shadow-[0_25px_70px_rgba(1,31,72,0.45)] backdrop-blur-md sm:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand via-gold to-brand"
            />
            <Quote
              size={64}
              strokeWidth={1}
              className="pointer-events-none absolute -top-2 right-6 text-white/[0.08] sm:right-8"
              aria-hidden="true"
            />

            <blockquote className="relative text-[clamp(17px,2.2vw,22px)] font-medium italic leading-[1.75] text-white/90">
              &ldquo;In the pursuit of your dreams, financial security, personal
              dignity, and family legacy, wealth creation and wealth protection
              go hand in hand. Whether you are building a career, growing a
              business, planning for retirement, creating generational wealth,
              or acquiring valuable assets, protecting those achievements is
              just as important as building them. Properly structured insurance
              coverage can serve as a vital shield, helping safeguard what
              matters most today while preserving the foundation of your legacy
              for generations to come.&rdquo;
            </blockquote>

            <div className="relative mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-sm font-bold text-white shadow-lg shadow-brand/20">
                PK
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Paul R. Kempton, MBA
                </p>
                <p className="text-xs text-white/60">Founder, AGUKA Financial Group</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
