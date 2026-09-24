import { Mail, Send } from "lucide-react";
import { listSubscribers, listCampaigns } from "@/lib/newsletter";
import { mailerEnabled } from "@/lib/mailer";
import { localeNames } from "@/lib/i18n/config";
import ExpandableTable from "@/components/dashboard/expandable-table";
import Reveal from "@/components/ui/reveal";
import NewsletterForm from "./newsletter-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Newsletter" };

const cardClass =
  "rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]";

export default async function NewsletterPage() {
  const [subscribers, campaigns] = await Promise.all([listSubscribers(), listCampaigns()]);
  const rwSubscriberCount = subscribers.filter((subscriber) => subscriber.locale === "rw").length;

  const rows = subscribers.map((subscriber) => ({
    email: subscriber.email,
    language: localeNames[subscriber.locale],
    subscribed: formatDate(subscriber.created_at),
  }));

  const campaignRows = campaigns.map((campaign) => ({
    subject: campaign.subject,
    languages: campaign.subject_rw ? "English + Kinyarwanda" : "English",
    delivered: campaign.failed_count
      ? `${campaign.sent_count} of ${campaign.recipient_count} (${campaign.failed_count} failed)`
      : `${campaign.sent_count} of ${campaign.recipient_count}`,
    sent: formatDate(campaign.created_at),
  }));

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Newsletter</h1>
          <p className="mt-1 text-sm text-muted">
            Write and send updates to everyone who subscribed from your homepage.
          </p>
        </div>
        <p className="text-xs font-semibold text-muted">
          {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}
        </p>
      </Reveal>

      <Reveal delay={0.05} className={cardClass}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff3e8] text-brand">
            <Send size={16} />
          </span>
          <h2 className="text-base font-semibold text-navy">Write a newsletter</h2>
        </div>
        <p className="mt-2 text-xs text-muted">
          Each subscriber gets their own copy with an unsubscribe link at the bottom.
        </p>
        {!mailerEnabled && (
          <p className="mt-3 rounded-[3px] bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Email sending is not configured yet (SMTP_USER / SMTP_APP_PASSWORD). You can write a
            newsletter, but it can&apos;t be sent until email is set up.
          </p>
        )}
        <div className="mt-5">
          <NewsletterForm
            subscriberCount={subscribers.length}
            rwSubscriberCount={rwSubscriberCount}
          />
        </div>
      </Reveal>

      {campaigns.length > 0 && (
        <Reveal delay={0.08} className={cardClass}>
          <h2 className="mb-4 text-base font-semibold text-navy">Sent newsletters</h2>
          <ExpandableTable
            rows={campaignRows}
            columns={[
              { key: "subject", label: "Subject" },
              { key: "languages", label: "Languages" },
              { key: "delivered", label: "Delivered" },
              { key: "sent", label: "Sent" },
            ]}
            initialCount={5}
          />
        </Reveal>
      )}

      <Reveal delay={0.1} className={cardClass}>
        <h2 className="mb-4 text-base font-semibold text-navy">Subscribers</h2>
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
              { key: "language", label: "Language" },
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
