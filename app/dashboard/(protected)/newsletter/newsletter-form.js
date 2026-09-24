"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { sendNewsletterAction } from "./actions";

const fieldClass =
  "w-full rounded-[3px] border border-gray-300 bg-cream px-3.5 py-3 text-[13px] font-normal text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

const labelClass = "flex flex-col gap-1.5 text-[11px] font-semibold text-ink";

const initialState = { ok: null, message: "" };

export default function NewsletterForm({ subscriberCount, rwSubscriberCount }) {
  const [state, action, pending] = useActionState(sendNewsletterAction, initialState);
  // The form remounts after every submit (keyed on state.at); refill it from
  // the returned values when sending failed so the admin keeps their draft.
  const draft = state.values || {};

  return (
    <form key={state.at || "draft"} action={action} className="flex flex-col gap-4">
      <label className={labelClass}>
        Subject
        <input
          name="subject"
          required
          maxLength={200}
          defaultValue={draft.subject}
          className={fieldClass}
          placeholder="e.g. Open enrollment tips for this fall"
        />
      </label>

      <label className={labelClass}>
        Message
        <textarea
          name="body"
          required
          rows={8}
          maxLength={20000}
          defaultValue={draft.body}
          className={fieldClass}
          placeholder={"Write your newsletter here.\n\nLeave a blank line between paragraphs."}
        />
      </label>

      <fieldset className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4">
        <legend className="px-1 text-xs font-bold uppercase tracking-wide text-navy">
          Kinyarwanda version (optional)
        </legend>
        <p className="-mt-1 text-[11px] text-muted">
          {rwSubscriberCount > 0
            ? `${rwSubscriberCount} ${rwSubscriberCount === 1 ? "subscriber" : "subscribers"} signed up in Kinyarwanda and will receive this version. Leave it empty to send them the English one.`
            : "Subscribers who sign up while browsing in Kinyarwanda will receive this version. Leave it empty to send everyone the English one."}
        </p>
        <label className={labelClass}>
          Subject (Kinyarwanda)
          <input name="subjectRw" maxLength={200} defaultValue={draft.subjectRw} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Message (Kinyarwanda)
          <textarea
            name="bodyRw"
            rows={6}
            maxLength={20000}
            defaultValue={draft.bodyRw}
            className={fieldClass}
          />
        </label>
      </fieldset>

      {state.message && (
        <p
          role="status"
          className={`rounded-[3px] px-3 py-2.5 text-xs font-medium ${
            state.ok ? "bg-green-50 text-green-800" : "bg-[#fff0f0] text-[#991b1b]"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || subscriberCount === 0}
        onClick={(event) => {
          const confirmMessage = `Send this newsletter to ${subscriberCount} ${
            subscriberCount === 1 ? "subscriber" : "subscribers"
          } now? This cannot be undone.`;
          if (!window.confirm(confirmMessage)) event.preventDefault();
        }}
        className="inline-flex items-center gap-2 self-start rounded-[3px] bg-gradient-to-br from-brand to-brand-dark px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={15} />
        {pending ? "Sending…" : `Send to ${subscriberCount} ${subscriberCount === 1 ? "subscriber" : "subscribers"}`}
      </button>
    </form>
  );
}
