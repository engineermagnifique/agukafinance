"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Eyebrow from "@/components/ui/eyebrow";
import { staggerContainer, fadeUp } from "@/lib/motion";

export default function PageHero({ eyebrow, title, subtitle, breadcrumb }) {
  return (
    <section className="relative overflow-hidden bg-navy py-14 text-center text-white sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerContainer}
        className="relative mx-auto max-w-2xl px-6"
      >
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.nav
            variants={fadeUp}
            aria-label="Breadcrumb"
            className="mb-4 flex items-center justify-center gap-1.5 text-[12px] font-medium text-white/60"
          >
            {breadcrumb.map((item, index) => (
              <span key={item.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight size={12} className="text-white/40" />}
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white">{item.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        {eyebrow && (
          <motion.div variants={fadeUp}>
            <Eyebrow align="center" tone="gold">
              {eyebrow}
            </Eyebrow>
          </motion.div>
        )}
        <motion.h1
          variants={fadeUp}
          className="mt-3 text-[clamp(28px,4.5vw,44px)] font-bold leading-[1.15]"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
