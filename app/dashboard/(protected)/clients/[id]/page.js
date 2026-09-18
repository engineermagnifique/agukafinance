import { notFound } from "next/navigation";
import { getLead, listLeadEvents, formatStatus, LEAD_STATUSES } from "@/lib/leads";
import { updateLeadStatusAction, addLeadNoteAction } from "../actions";
import Reveal from "@/components/ui/reveal";

export const dynamic = "force-dynamic";
export const metadata = { title: "Client detail" };

export default async function ClientDetailPage({ params }) {
  const { id } = await params;
  const lead = await getLead(Number(id));
  if (!lead) notFound();
  const events = await listLeadEvents(lead.id);

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            {lead.first_name} {lead.last_name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {lead.service} · Requested {formatDate(lead.created_at)}
          </p>
        </div>
        <form action={updateLeadStatusAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={lead.id} />
          <select
            name="status"
            defaultValue={lead.status}
            className="rounded-[3px] border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatStatus(s)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-[3px] bg-navy px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Update status
          </button>
        </form>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal
          delay={0.05}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)] lg:col-span-1"
        >
          <h2 className="text-base font-semibold text-navy">Contact details</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Email</dt>
              <dd className="text-ink">
                <a href={`mailto:${lead.email}`} className="hover:text-brand">
                  {lead.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Phone</dt>
              <dd className="text-ink">
                <a href={`tel:${lead.phone}`} className="hover:text-brand">
                  {lead.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-muted">Preferred contact</dt>
              <dd className="text-ink">{lead.preferred_contact || "—"}</dd>
            </div>
            {lead.coverage_needs && (
              <div>
                <dt className="text-xs font-semibold uppercase text-muted">Coverage needs</dt>
                <dd className="text-ink">{lead.coverage_needs}</dd>
              </div>
            )}
            {lead.tax_support && (
              <div>
                <dt className="text-xs font-semibold uppercase text-muted">Tax support</dt>
                <dd className="text-ink">{lead.tax_support}</dd>
              </div>
            )}
            {lead.message && (
              <div>
                <dt className="text-xs font-semibold uppercase text-muted">Message</dt>
                <dd className="text-ink">{lead.message}</dd>
              </div>
            )}
            {lead.attachment_name && (
              <div>
                <dt className="text-xs font-semibold uppercase text-muted">Attachment</dt>
                <dd className="text-ink">
                  <a
                    href={`/api/dashboard/attachments/${lead.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:text-brand-dark"
                  >
                    {lead.attachment_name || "Download file"}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </Reveal>

        <Reveal
          delay={0.1}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)] lg:col-span-2"
        >
          <h2 className="text-base font-semibold text-navy">Follow-up log</h2>

          <form action={addLeadNoteAction} className="mt-4 flex flex-col gap-3 border-b border-gray-100 pb-5">
            <input type="hidden" name="id" value={lead.id} />
            <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-ink">
              Add a note
              <textarea
                name="note"
                required
                rows={2}
                className="rounded-[3px] border border-gray-300 bg-cream px-3.5 py-3 text-[13px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="Called and left voicemail, will try again tomorrow…"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-ink">
              Next follow-up date (optional)
              <input
                type="date"
                name="nextFollowUpAt"
                defaultValue={lead.next_follow_up_at ? lead.next_follow_up_at.slice(0, 10) : ""}
                className="rounded-[3px] border border-gray-300 bg-cream px-3.5 py-3 text-[13px]"
              />
            </label>
            <button
              type="submit"
              className="self-start rounded-[3px] bg-brand px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Save note
            </button>
          </form>

          {lead.next_follow_up_at && (
            <p className="mt-4 text-xs font-semibold text-brand-dark">
              Next follow-up: {formatDate(lead.next_follow_up_at)}
            </p>
          )}

          <ul className="mt-4 flex flex-col gap-4">
            {events.map((event) => (
              <li key={event.id} className="text-sm">
                <p className="text-ink">{event.body}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {event.type === "status_change" ? "Status update" : "Note"} · {formatDate(event.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
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
