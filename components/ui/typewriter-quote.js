"use client";

import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.016, delayChildren: 0.1 },
  },
};

const word = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
};

// Reveals text word-by-word, quickly, as if it were being typed live.
export default function TypewriterQuote({ text, className }) {
  const [done, setDone] = useState(false);
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={container}
      onAnimationComplete={() => setDone(true)}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
      {!done && (
        <motion.span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] bg-current align-middle"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      )}
    </motion.span>
  );
}
