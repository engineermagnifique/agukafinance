"use client";

import { motion } from "framer-motion";

export default function FlowingGlow({ color = "bg-white" }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute -left-1/4 bottom-[-10%] h-[70%] w-[70%] rounded-full ${color} opacity-30 blur-3xl`}
      animate={{
        x: ["0%", "18%", "0%"],
        y: ["0%", "-14%", "0%"],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
