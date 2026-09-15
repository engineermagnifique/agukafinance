"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxDecor({ blobs }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {blobs.map((blob, index) => (
        <Blob key={index} scrollYProgress={scrollYProgress} {...blob} />
      ))}
    </div>
  );
}

function Blob({ scrollYProgress, range = [-40, 40], className }) {
  const y = useTransform(scrollYProgress, [0, 1], range);
  return <motion.div style={{ y }} className={className} />;
}
