"use client";

import { useState } from "react";
import { serviceIconNames } from "@/lib/service-icons";

const fieldClass =
  "w-full rounded-[3px] border border-gray-300 bg-cream px-3.5 py-3 text-[13px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

const labelClass = "flex flex-col gap-1.5 text-[11px] font-semibold text-ink";

export default function ServiceForm({ action, service }) {
  const [ctaType, setCtaType] = useState(service?.ctaType || "info");

  return (
    <form action={action} className="flex flex-col gap-4">
      {service && <input type="hidden" name="id" value={service.id} />}

      <label className={labelClass}>
        Title
        <input name="title" defaultValue={service?.title} required maxLength={80} className={fieldClass} />
      </label>

      <label className={labelClass}>
        Description
        <textarea
          name="description"
          defaultValue={service?.description}
          required
          rows={3}
          maxLength={400}
          className={fieldClass}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Icon
          <select name="icon" defaultValue={service?.icon || "Shield"} className={fieldClass}>
            {serviceIconNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Display order
          <input
            type="number"
            name="sortOrder"
            defaultValue={service?.sortOrder ?? 0}
            className={fieldClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Call to action type
        <select
          name="ctaType"
          value={ctaType}
          onChange={(event) => setCtaType(event.target.value)}
          className={fieldClass}
        >
          <option value="info">Request info button (opens consultation form)</option>
          <option value="apply">External apply link</option>
          <option value="accordion">Expandable list of options</option>
          <option value="none">No call to action</option>
        </select>
      </label>

      {ctaType !== "none" && (
        <label className={labelClass}>
          Button label
          <input
            name="ctaLabel"
            defaultValue={service?.ctaLabel || ""}
            maxLength={60}
            className={fieldClass}
            placeholder={
              ctaType === "apply"
                ? "Apply now"
                : ctaType === "accordion"
                  ? "View options"
                  : "Request information"
            }
          />
        </label>
      )}

      {ctaType === "apply" && (
        <label className={labelClass}>
          Apply URL
          <input
            name="ctaHref"
            type="url"
            defaultValue={service?.ctaHref || ""}
            className={fieldClass}
            placeholder="https://…"
          />
        </label>
      )}

      {ctaType === "accordion" && (
        <label className={labelClass}>
          Options (one per line, each opens the consultation form)
          <textarea
            name="accordionItems"
            defaultValue={(service?.accordionItems || []).join("\n")}
            rows={5}
            className={fieldClass}
            placeholder={"Auto\nHome\nBoat"}
          />
        </label>
      )}

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={service ? service.isActive : true}
          className="h-4 w-4 accent-brand"
        />
        Show on homepage
      </label>

      <button
        type="submit"
        className="mt-2 self-start rounded-[3px] bg-gradient-to-br from-brand to-brand-dark px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        {service ? "Save changes" : "Add service"}
      </button>
    </form>
  );
}
