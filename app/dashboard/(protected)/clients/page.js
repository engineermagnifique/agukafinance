import Link from "next/link";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { listLeads, formatStatus, LEAD_STATUSES } from "@/lib/leads";
import Reveal from "@/components/ui/reveal";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients" };

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  in_progress: "bg-brand/15 text-brand-dark",
  done: "bg-green-100 text-green-700",
};

const SORT_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "service", label: "Service" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Requested" },
];

function initialsFor(first, last) {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
}

export default async function ClientsPage({ searchParams }) {
  const params = await searchParams;
  const status =
    typeof params?.status === "string" && LEAD_STATUSES.includes(params.status) ? params.status : null;
  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const sort = typeof params?.sort === "string" ? params.sort : "created_at";
  const dir = params?.dir === "asc" ? "asc" : "desc";
  const leads = listLeads({ status, q: q || undefined, sort, dir });

  function sortHref(columnKey) {
    const nextDir = sort === columnKey && dir === "asc" ? "desc" : "asc";
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (q) query.set("q", q);
    query.set("sort", columnKey);
    query.set("dir", nextDir);
    return `/dashboard/clients?${query.toString()}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Clients</h1>
          <p className="mt-1 text-sm text-muted">
            Every consultation request, from first contact to completed service.
          </p>
        </div>
        <p className="text-xs font-semibold text-muted">
          Showing {leads.length} {leads.length === 1 ? "client" : "clients"}
        </p>
      </Reveal>

      {q && (
        <Reveal delay={0.03} className="flex items-center gap-2 text-sm text-muted">
          <span>
            Showing results for <span className="font-semibold text-navy">&ldquo;{q}&rdquo;</span>
          </span>
          <Link href="/dashboard/clients" className="text-xs font-semibold text-brand hover:text-brand-dark">
            Clear
          </Link>
        </Reveal>
      )}

      <Reveal delay={0.05} className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/clients"
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            !status ? "bg-brand text-white" : "border border-gray-200 bg-white text-ink hover:border-brand/40"
          }`}
        >
          All
        </Link>
        {LEAD_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/dashboard/clients?status=${s}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              status === s ? "bg-brand text-white" : "border border-gray-200 bg-white text-ink hover:border-brand/40"
            }`}
          >
            {formatStatus(s)}
          </Link>
        ))}
      </Reveal>

      <Reveal
        delay={0.1}
        className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
      >
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-cream text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              {SORT_COLUMNS.map((column) => {
                const isSorted = sort === column.key;
                return (
                  <th key={column.key} className="px-4 py-3">
                    <Link
                      href={sortHref(column.key)}
                      className={`inline-flex items-center gap-1 transition-colors hover:text-navy ${
                        isSorted ? "text-navy" : ""
                      }`}
                    >
                      {column.label}
                      {isSorted ? (
                        dir === "asc" ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )
                      ) : (
                        <ArrowUpDown size={12} className="opacity-40" />
                      )}
                    </Link>
                  </th>
                );
              })}
              <th className="px-4 py-3">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/clients/${lead.id}`}
                    className="flex items-center gap-2.5 font-semibold text-navy hover:text-brand"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#fff3e8] text-xs font-bold text-brand">
                      {initialsFor(lead.first_name, lead.last_name)}
                    </span>
                    {lead.first_name} {lead.last_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink">{lead.service}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[lead.status]}`}>
                    {formatStatus(lead.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">{formatDate(lead.created_at)}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {lead.email}
                  <br />
                  {lead.phone}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}
