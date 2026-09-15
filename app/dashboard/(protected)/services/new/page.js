import Reveal from "@/components/ui/reveal";
import ServiceForm from "../service-form";
import { createServiceAction } from "../actions";

export const metadata = { title: "Add service" };

export default function NewServicePage() {
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy">Add service</h1>
        <p className="mt-1 text-sm text-muted">
          This will appear as a new card in the homepage services section.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(15,28,46,0.04)]">
        <ServiceForm action={createServiceAction} />
      </Reveal>
    </div>
  );
}
