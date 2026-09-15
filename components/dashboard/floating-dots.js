"use client";

import { motion } from "framer-motion";

const dots = [
  { size: 6, top: "18%", left: "62%", duration: 7, distance: 10 },
  { size: 4, top: "55%", left: "78%", duration: 9, distance: 8 },
  { size: 5, top: "75%", left: "58%", duration: 6, distance: 9 },
  { size: 3, top: "35%", left: "88%", duration: 8, distance: 6 },
];

export default function FloatingDots() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-white/30"
          style={{ width: dot.size, height: dot.size, top: dot.top, left: dot.left }}
          animate={{ x: [0, dot.distance, 0], y: [0, -dot.distance / 2, 0] }}
          transition={{ duration: dot.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
