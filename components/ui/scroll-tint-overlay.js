"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollTintOverlay({ color = "rgba(1,31,72,0.05)" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ opacity, backgroundColor: color }}
      className="pointer-events-none absolute inset-0"
    />
  );
}
