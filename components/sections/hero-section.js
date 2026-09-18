"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import heroImage from "@/public/images/hero-sunset.png";
import { staggerContainer, fadeUp, floatLoop } from "@/lib/motion";
import { scrollToContact } from "@/lib/scroll";
import FlipWord from "@/components/ui/flip-word";
import ScrollFlipWord from "@/components/ui/scroll-flip-word";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (document.readyState === "complete") {
      const frame = requestAnimationFrame(() => setLoaded(true));
      return () => cancelAnimationFrame(frame);
    }

    function handleLoad() {
      setLoaded(true);
    }

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[560px] items-start overflow-hidden bg-navy text-white sm:min-h-[665px]"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl sm:h-80 sm:w-80"
        animate={floatLoop(24, 9)}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-1/3 h-56 w-56 rounded-full bg-gold/15 blur-3xl sm:h-72 sm:w-72"
        animate={floatLoop(18, 11)}
      />

      <motion.div className="absolute inset-0" style={{ scale: imageScale, y: imageY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.35, opacity: 0 }}
          animate={loaded ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={heroImage}
            alt="A family standing in front of their home at sunset, arms around each other"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_center] sm:object-center"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/10 sm:bg-[linear-gradient(90deg,#011f48f5_0%,#011f48d7_40%,#011f4899_70%,#011f4866_100%)]" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[55%] overflow-hidden bg-gradient-to-br from-brand/25 via-brand/5 to-transparent sm:block"
        style={{ clipPath: "polygon(0 0, 62% 0, 38% 100%, 0% 100%)" }}
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        initial="hidden"
        animate={loaded ? "visible" : "hidden"}
        variants={staggerContainer}
        style={{ opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-7xl px-6 py-16 sm:py-20 lg:px-10"
      >
        <div className="max-w-[680px]">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/85 backdrop-blur-sm"
          >
            <Sparkles size={13} className="text-gold" />
            Insurances. Taxes. Financial Planning Solutions
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-[clamp(30px,7.5vw,69px)] font-bold leading-[1.08] tracking-tight"
          >
            <span className="block whitespace-nowrap">
              Building and <FlipWord color="#f07d1a">Protecting</FlipWord>
            </span>
            <span className="block whitespace-nowrap text-gold">
              <ScrollFlipWord progress={scrollYProgress} range={[0, 0.12]} color="#ffffff">
                What Matters Most
              </ScrollFlipWord>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[480px] text-sm leading-[1.75] text-white/75 sm:text-base"
          >
            Personalized trusted insurance and financial product strategies
            delivered with care, transparency and honesty.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7"
          >
            <Link
              href="/?service=General%20Consultation#contact"
              onClick={scrollToContact}
              className="group/cta relative flex items-center gap-4 overflow-hidden rounded-full bg-gradient-to-br from-brand to-brand-dark py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
              />
              <span className="relative py-2.5">Check Quote Today</span>
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover/cta:translate-x-0.5">
                <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-6 top-8 hidden items-center gap-3 rounded-md bg-white/95 py-3.5 pl-4 pr-5 shadow-xl backdrop-blur sm:flex lg:right-10"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff3e8] text-brand">
          <ShieldCheck size={19} />
        </span>
        <span className="max-w-[160px] text-[13px] font-bold leading-tight text-navy">
          Backed by 5+ years of professional experience
        </span>
      </motion.div>
    </section>
  );
}
