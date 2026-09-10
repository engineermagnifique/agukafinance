"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/site-config";

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const active = testimonials[index];

  function go(nextIndex) {
    setIndex((nextIndex + testimonials.length) % testimonials.length);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative rounded-sm border border-gray-200 bg-white px-6 py-10 shadow-[0_16px_40px_rgba(15,28,46,0.08)] sm:px-14 sm:py-14">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff3e8] text-brand">
          <Quote size={22} fill="currentColor" strokeWidth={0} />
        </span>

        <div aria-live="polite" className="min-h-[160px] sm:min-h-[130px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-6"
            >
              <p className="text-lg leading-relaxed text-ink sm:text-xl">
                &ldquo;{active.quote}&rdquo;
              </p>
              <footer className="mt-6">
                <p className="font-bold text-navy">{active.name}</p>
                <p className="text-sm text-muted">{active.role}</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous testimonial"
          className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy transition-colors hover:border-brand hover:text-brand"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          {testimonials.map((testimonial, dotIndex) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => go(dotIndex)}
              aria-label={`Show testimonial ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={`h-2.5 rounded-full transition-all ${
                dotIndex === index ? "w-6 bg-brand" : "w-2.5 bg-navy/20"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next testimonial"
          className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy transition-colors hover:border-brand hover:text-brand"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
