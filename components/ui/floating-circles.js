"use client";

import { motion } from "framer-motion";

const circles = [
  { size: 10, top: "6%", left: "4%", color: "bg-brand/40", duration: 13, distance: 55 },
  { size: 8, top: "10%", left: "92%", color: "bg-gold/50", duration: 10, distance: 45 },
  { size: 6, top: "22%", left: "2%", color: "bg-white/70", duration: 9, distance: 40 },
  { size: 12, top: "30%", left: "95%", color: "bg-brand/30", duration: 15, distance: 65 },
  { size: 14, top: "45%", left: "3%", color: "bg-gold/40", duration: 17, distance: 75 },
  { size: 7, top: "52%", left: "94%", color: "bg-white/60", duration: 11, distance: 50 },
  { size: 9, top: "66%", left: "5%", color: "bg-brand/35", duration: 12, distance: 55 },
  { size: 11, top: "74%", left: "90%", color: "bg-gold/45", duration: 14, distance: 60 },
  { size: 8, top: "88%", left: "8%", color: "bg-white/60", duration: 10, distance: 50 },
  { size: 10, top: "92%", left: "88%", color: "bg-brand/40", duration: 16, distance: 70 },
];

export default function FloatingCircles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {circles.map((circle, index) => (
        <motion.span
          key={index}
          className={`absolute rounded-full blur-[1px] ${circle.color}`}
          style={{ width: circle.size, height: circle.size, top: circle.top, left: circle.left }}
          animate={{ x: [0, circle.distance, 0], y: [0, -10, 0] }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
