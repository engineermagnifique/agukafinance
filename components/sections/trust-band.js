"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import dayImage from "@/public/images/hero-daylight.png";
import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";

const stats = [
  { value: "10+", label: "Years serving Texas families" },
  { value: "3", label: "Insurance, mortgage & tax lines" },
  { value: "100%", label: "Personal, honest guidance" },
];

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
        <Reveal className="max-w-md">
          <Eyebrow>WHY FAMILIES TRUST US</Eyebrow>
          <h2 className="mt-3 text-[clamp(28px,3.6vw,42px)] font-bold leading-[1.15]">
            A steady partner for the decisions that matter
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            From your first policy to your next big move, our team walks
            alongside you with clear guidance instead of sales pressure.
          </p>
        </Reveal>

        <div className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={0.1 + index * 0.1}
              whileHover={{ y: -4 }}
              className="border-l-2 border-brand/60 pl-4 transition-colors duration-300 hover:border-gold"
            >
              <p className="text-4xl font-extrabold tabular-nums text-gold">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/70 sm:whitespace-nowrap">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
