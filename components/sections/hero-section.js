"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import heroImage from "@/public/images/hero-sunset.png";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { values } from "@/lib/site-config";
import { scrollToContact } from "@/lib/scroll";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[560px] items-start overflow-hidden bg-navy text-white sm:min-h-[665px]"
    >
      <Image
        src={heroImage}
        alt="A family standing in front of their home at sunset, arms around each other"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[65%_center] sm:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/10 sm:bg-[linear-gradient(90deg,#011f48f5_0%,#011f48d7_40%,#011f4899_70%,#011f4866_100%)]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative mx-auto w-full max-w-7xl px-6 py-16 sm:py-20 lg:px-10"
      >
        <div className="max-w-[680px]">
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(30px,7.5vw,69px)] font-bold leading-[1.08] tracking-tight"
          >
            <span className="block whitespace-nowrap">
              Building and Protecting
            </span>
            <span className="block whitespace-nowrap text-gold">
              What Matters Most
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-10 max-w-[780px] text-sm leading-[1.75] text-white/75 sm:text-base"
          >
            At Aguka, we proudly provide trusted{" "}
            <strong className="font-semibold text-white">
              Insurance, Mortgage, and Tax Services Support
            </strong>{" "}
            with clarity, care, and transparency. We help individuals,
            families, and small businesses make informed financial decisions
            and keep more of their hard-earned money working for them.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7"
          >
            <Link
              href="/?service=General%20Consultation#contact"
              onClick={scrollToContact}
              className="rounded-[3px] bg-gradient-to-br from-brand to-brand-dark px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Get Started Today
            </Link>
            <a
              href="#services"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-gold"
            >
              Explore Our Services
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/20 pt-6 text-xs text-white/70"
          >
            {values.map((value) => (
              <span key={value} className="inline-flex items-center gap-1.5">
                <Check size={13} className="text-brand" strokeWidth={3} />
                {value}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 right-6 hidden items-center gap-3 rounded-md bg-white/95 py-3.5 pl-4 pr-5 shadow-xl backdrop-blur sm:flex lg:right-10"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff3e8] text-brand">
          <ShieldCheck size={19} />
        </span>
        <span className="leading-tight">
          <span className="block text-lg font-bold text-navy">10+ Years</span>
          <span className="block text-[11px] text-muted">
            Serving Texas families
          </span>
        </span>
      </motion.div>
    </section>
  );
}
