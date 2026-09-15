"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { getCookieConsent, setCookieConsent } from "@/lib/cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getCookieConsent()) return undefined;

    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleChoice(value) {
    setCookieConsent(value);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-navy/97 px-6 py-5 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.25)] backdrop-blur sm:px-10"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold">
                <Cookie size={18} />
              </span>
              <p className="text-[15px] leading-relaxed text-white/80 sm:text-base">
                We use cookies to understand site traffic and improve your
                experience. You can accept or reject non-essential cookies at
                any time.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => handleChoice("rejected")}
                className="rounded-[3px] border border-white/20 px-4 py-2.5 text-[15px] font-semibold text-white/80 transition-colors hover:bg-white/10 sm:text-base"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleChoice("accepted")}
                className="rounded-[3px] bg-gradient-to-br from-brand to-brand-dark px-5 py-2.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-base"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
