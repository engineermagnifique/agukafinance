import { notFound } from "next/navigation";
import Reveal from "@/components/ui/reveal";
import ServiceForm from "../../service-form";
import { updateServiceAction } from "../../actions";
import { getService } from "@/lib/services";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({ params }) {
  const { id } = await params;
  const service = getService(Number(id));
  if (!service) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-navy">Edit service</h1>
        <p className="mt-1 text-sm text-muted">{service.title}</p>
      </Reveal>
      <Reveal delay={0.1} className="max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(15,28,46,0.04)]">
        <ServiceForm action={updateServiceAction} service={service} />
      </Reveal>
    </div>
  );
}
