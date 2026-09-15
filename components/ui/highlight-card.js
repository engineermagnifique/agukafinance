"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

export default function HighlightCard({ item, isFocused, onHoverStart, onHoverEnd }) {
  return (
    <motion.div
      className="h-full"
      animate={{
        scale: isFocused ? 1.06 : 1,
        y: isFocused ? -6 : 0,
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ zIndex: isFocused ? 10 : 1 }}
    >
      <Tilt
        tiltMaxAngleX={12}
        tiltMaxAngleY={12}
        perspective={700}
        scale={1.03}
        transitionSpeed={1000}
        glareEnable
        glareMaxOpacity={0.25}
        glareColor="#f07d1a"
        glarePosition="all"
        glareBorderRadius="12px"
        onEnter={onHoverStart}
        onLeave={onHoverEnd}
        className={`group relative flex h-full flex-col items-center gap-2.5 overflow-hidden rounded-xl border border-gray-100 bg-white px-4 py-6 text-center text-navy shadow-[0_16px_40px_rgba(15,28,46,0.12)] transition-shadow duration-300 ${
          isFocused ? "shadow-[0_24px_50px_rgba(15,28,46,0.24)]" : ""
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-dark transition-transform duration-300 group-hover:scale-x-100"
        />

        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#fff3e8] text-brand transition-transform duration-300 group-hover:scale-110">
          <item.icon size={24} />
        </span>
        <p className="text-sm font-semibold leading-snug">{item.title}</p>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted">{item.description}</p>
      </Tilt>
    </motion.div>
  );
}
