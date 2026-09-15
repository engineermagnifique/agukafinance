import Link from "next/link";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import { listServices } from "@/lib/services";
import { getServiceIcon } from "@/lib/service-icons";
import ConfirmSubmitButton from "@/components/ui/confirm-submit-button";
import Reveal from "@/components/ui/reveal";
import { deleteServiceAction, toggleServiceActiveAction, moveServiceAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services" };

export default function ServicesPage() {
  const services = listServices();

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Services</h1>
          <p className="mt-1 text-sm text-muted">
            Manage what appears in the &quot;How we can help&quot; section on your homepage.
          </p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="inline-flex items-center gap-1.5 rounded-[3px] bg-gradient-to-br from-brand to-brand-dark px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} /> Add service
        </Link>
      </Reveal>

      <Reveal
        delay={0.1}
        className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
      >
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-cream text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Call to action</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <tr key={service.id} className="transition-colors hover:bg-cream/60">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <form action={moveServiceAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          type="submit"
                          disabled={index === 0}
                          aria-label="Move up"
                          className="grid h-6 w-6 place-items-center rounded-md text-muted transition-colors hover:bg-cream hover:text-navy disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronUp size={15} />
                        </button>
                      </form>
                      <form action={moveServiceAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={index === services.length - 1}
                          aria-label="Move down"
                          className="grid h-6 w-6 place-items-center rounded-md text-muted transition-colors hover:bg-cream hover:text-navy disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronDown size={15} />
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff3e8] text-brand">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="font-semibold text-navy">{service.title}</p>
                        <p className="line-clamp-1 max-w-xs text-xs text-muted">{service.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize text-ink">{service.ctaType}</td>
                  <td className="px-4 py-3">
                    <form action={toggleServiceActiveAction}>
                      <input type="hidden" name="id" value={service.id} />
                      <input type="hidden" name="isActive" value={service.isActive ? "0" : "1"} />
                      <button
                        type="submit"
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {service.isActive ? "Active" : "Hidden"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/dashboard/services/${service.id}/edit`} className="text-xs font-semibold text-brand">
                        Edit
                      </Link>
                      <form action={deleteServiceAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${service.title}"? This can't be undone.`}
                          className="text-xs font-semibold text-red-600"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                  No services yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
