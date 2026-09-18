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
      className="relative isolate overflow-hidden bg-navy py-16 text-white sm:py-20"
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
        <Reveal className="max-w-lg">
          <Eyebrow>MESSAGE OF THE MONTH</Eyebrow>

          <Quote
            size={26}
            strokeWidth={1.5}
            className="mt-4 text-brand"
            aria-hidden="true"
          />

          <blockquote className="mt-3 text-[clamp(15px,1.7vw,18px)] font-medium italic leading-[1.7] text-white/90">
            In the pursuit of your dreams, financial security, personal
            dignity, and family legacy, wealth creation and wealth protection
            go hand in hand. Whether you are building a career, growing a
            business, planning for retirement, creating generational wealth,
            or acquiring valuable assets, protecting those achievements is
            just as important as building them. Properly structured insurance
            coverage can serve as a vital shield, helping safeguard what
            matters most today while preserving the foundation of your legacy
            for generations to come.
          </blockquote>

          <div className="mt-5 flex items-center gap-3 border-t border-white/15 pt-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-bold text-white">
              PK
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                Paul R. Kempton, MBA
              </p>
              <p className="text-xs text-white/60">Founder, AGUKA Financial Group</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
