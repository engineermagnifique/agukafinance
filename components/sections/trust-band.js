"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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
          <blockquote className="mt-4 text-[clamp(18px,2.4vw,24px)] font-medium italic leading-[1.6] text-white/90">
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
          <p className="mt-5 text-sm font-semibold text-gold">
            Paul R. Kempton, MBA, Founder
          </p>
        </Reveal>
      </div>
    </section>
  );
}
