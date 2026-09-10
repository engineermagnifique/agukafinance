"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { personalLinesCoverage } from "@/lib/site-config";
import { useConsultationModal } from "@/components/ui/consultation-modal-provider";

export default function CoverageAccordion() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { openFor } = useConsultationModal();

  return (
    <div className="mt-auto pt-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-2.5 text-left text-xs font-semibold text-brand"
      >
        <span>View coverage options</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={17} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="mt-3 max-h-[225px] overflow-y-auto border-t border-brand/20">
              {personalLinesCoverage.map((item) => (
                <li key={item} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => openFor(`Personal Lines: ${item}`)}
                    className="flex w-full items-center justify-between gap-2.5 py-2.5 text-left text-xs text-ink transition-colors hover:text-brand"
                  >
                    <span>{item}</span>
                    <ArrowRight size={13} className="text-brand" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
