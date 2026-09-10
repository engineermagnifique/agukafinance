"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  once = true,
  whileHover,
}) {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, once }}
      variants={fadeUp}
      custom={delay}
      whileHover={whileHover}
    >
      {children}
    </MotionTag>
  );
}
