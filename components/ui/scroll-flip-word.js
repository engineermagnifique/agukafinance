"use client";

import { motion, useTransform } from "framer-motion";

export default function ScrollFlipWord({
  children,
  progress,
  range = [0, 1],
  color = "#f07d1a",
}) {
  const rotateX = useTransform(progress, range, [0, 180]);

  return (
    <span className="inline-block" style={{ perspective: 400 }}>
      <motion.span
        className="relative inline-block"
        style={{ rotateX, transformStyle: "preserve-3d" }}
      >
        <span className="inline-block" style={{ backfaceVisibility: "hidden" }}>
          {children}
        </span>
        <span
          className="absolute inset-0 inline-block"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
            color,
          }}
        >
          {children}
        </span>
      </motion.span>
    </span>
  );
}
