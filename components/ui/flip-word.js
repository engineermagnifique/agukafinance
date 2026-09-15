"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FlipWord({ children, color = "#f07d1a" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block cursor-default"
      style={{ perspective: 400 }}
    >
      <motion.span
        className="relative inline-block"
        animate={{ rotateX: hovered ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
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
