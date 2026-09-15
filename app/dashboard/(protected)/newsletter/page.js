import { Mail } from "lucide-react";
import { listSubscribers } from "@/lib/newsletter";
import ExpandableTable from "@/components/dashboard/expandable-table";
import Reveal from "@/components/ui/reveal";

export const dynamic = "force-dynamic";
export const metadata = { title: "Newsletter" };

export default function NewsletterPage() {
  const subscribers = listSubscribers();
  const rows = subscribers.map((subscriber) => ({
    email: subscriber.email,
    subscribed: formatDate(subscriber.created_at),
  }));

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Newsletter</h1>
          <p className="mt-1 text-sm text-muted">
            Everyone who has subscribed for updates from your homepage.
          </p>
        </div>
        <p className="text-xs font-semibold text-muted">
          {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
      >
        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff3e8] text-brand">
              <Mail size={22} />
            </span>
            <p className="text-sm text-muted">No newsletter subscribers yet.</p>
          </div>
        ) : (
          <ExpandableTable
            rows={rows}
            columns={[
              { key: "email", label: "Email" },
              { key: "subscribed", label: "Subscribed" },
            ]}
            initialCount={10}
          />
        )}
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
