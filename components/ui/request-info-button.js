"use client";

import { useConsultationModal } from "@/components/ui/consultation-modal-provider";

export default function RequestInfoButton({ service, className, children }) {
  const { openFor } = useConsultationModal();

  return (
    <button type="button" onClick={() => openFor(service)} className={className}>
      {children}
    </button>
  );
}
