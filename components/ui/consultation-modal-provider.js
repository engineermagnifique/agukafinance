"use client";

import { createContext, useContext, useState, Suspense } from "react";
import Modal from "@/components/ui/modal";
import ConsultationForm from "@/components/ui/consultation-form";

const ConsultationModalContext = createContext(null);

export function useConsultationModal() {
  const context = useContext(ConsultationModalContext);
  if (!context) {
    throw new Error(
      "useConsultationModal must be used within a ConsultationModalProvider"
    );
  }
  return context;
}

const modalFormClass =
  "flex max-h-[85vh] flex-col gap-4 overflow-y-auto rounded-sm border-t-4 border-brand bg-white p-6 shadow-2xl sm:p-8";

export default function ConsultationModalProvider({ children }) {
  const [service, setService] = useState(null);

  return (
    <ConsultationModalContext.Provider value={{ openFor: setService }}>
      {children}

      <Modal
        open={Boolean(service)}
        onClose={() => setService(null)}
        title="Request a free consultation"
      >
        <Suspense fallback={null}>
          {service && (
            <ConsultationForm initialService={service} className={modalFormClass} />
          )}
        </Suspense>
      </Modal>
    </ConsultationModalContext.Provider>
  );
}
