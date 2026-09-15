"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Eyebrow from "@/components/ui/eyebrow";
import {
  insuranceServicePrefix,
  preferredContactOptions,
  serviceOptions,
  taxSupportOptions,
} from "@/lib/site-config";

const initialState = {
  service: "General Consultation",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  coverageNeeds: "",
  taxSupport: taxSupportOptions[0],
  preferredContact: preferredContactOptions[0],
  website: "",
  consent: false,
};

const fieldClass =
  "w-full rounded-[3px] border border-gray-300 bg-cream px-3.5 py-3 text-[13px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

const labelClass = "flex flex-col gap-1.5 text-[11px] font-semibold text-ink";

export default function ConsultationForm({ initialService = null, className }) {
  const searchParams = useSearchParams();
  const prefillService = initialService ?? searchParams.get("service");

  const [values, setValues] = useState(() => ({
    ...initialState,
    service:
      prefillService && isKnownService(prefillService)
        ? prefillService
        : initialState.service,
  }));
  const [appliedPrefill, setAppliedPrefill] = useState(prefillService);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (
    prefillService !== appliedPrefill &&
    prefillService &&
    isKnownService(prefillService)
  ) {
    setAppliedPrefill(prefillService);
    setValues((prev) => ({ ...prev, service: prefillService }));
  }

  const showCoverage = useMemo(
    () => insuranceServicePrefix.test(values.service),
    [values.service]
  );
  const showTaxSupport = values.service === "Tax Services";

  function update(field) {
    return (event) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setStatus("success");
      setValues(initialState);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not send your request. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        className ??
        "flex flex-col gap-4 border-t-4 border-brand bg-white p-7 shadow-[0_16px_40px_rgba(15,28,46,0.1)] sm:p-9"
      }
    >
      <Eyebrow>FREE CONSULTATION</Eyebrow>
      <h3 className="text-2xl font-bold text-navy sm:text-[29px]">
        How can we help?
      </h3>

      <label className={labelClass}>
        Service of interest
        <select
          value={values.service}
          onChange={update("service")}
          className={fieldClass}
          required
        >
          {serviceOptions.map((group, index) =>
            group.group ? (
              <optgroup key={group.group} label={group.group}>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
            ) : (
              group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )
          )}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          First name
          <input
            className={fieldClass}
            value={values.firstName}
            onChange={update("firstName")}
            required
            maxLength={80}
            autoComplete="given-name"
          />
        </label>
        <label className={labelClass}>
          Last name
          <input
            className={fieldClass}
            value={values.lastName}
            onChange={update("lastName")}
            required
            maxLength={80}
            autoComplete="family-name"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Email
          <input
            type="email"
            className={fieldClass}
            value={values.email}
            onChange={update("email")}
            required
            maxLength={160}
            autoComplete="email"
          />
        </label>
        <label className={labelClass}>
          Phone
          <input
            type="tel"
            className={fieldClass}
            value={values.phone}
            onChange={update("phone")}
            required
            maxLength={40}
            autoComplete="tel"
          />
        </label>
      </div>

      <AnimatePresence initial={false}>
        {showCoverage && (
          <motion.label
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${labelClass} overflow-hidden`}
          >
            What would you like to protect?
            <textarea
              rows={3}
              maxLength={1000}
              placeholder="Tell us briefly about your coverage needs."
              className={fieldClass}
              value={values.coverageNeeds}
              onChange={update("coverageNeeds")}
            />
          </motion.label>
        )}

        {showTaxSupport && (
          <motion.label
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${labelClass} overflow-hidden`}
          >
            Tax support needed
            <select
              className={fieldClass}
              value={values.taxSupport}
              onChange={update("taxSupport")}
            >
              {taxSupportOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </motion.label>
        )}
      </AnimatePresence>

      <label className={labelClass}>
        Preferred contact method
        <select
          className={fieldClass}
          value={values.preferredContact}
          onChange={update("preferredContact")}
          required
        >
          {preferredContactOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        Leave this field empty
        <input
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={update("website")}
        />
      </label>

      <label className="flex items-start gap-2.5 text-[12px] font-medium leading-relaxed text-muted">
        <input
          type="checkbox"
          required
          checked={values.consent}
          onChange={update("consent")}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />
        <span>
          I agree to be contacted about my request. Submitting this form
          does not create a client relationship or guarantee eligibility,
          coverage, rates, or tax outcomes.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group/submit relative overflow-hidden rounded-[3px] bg-gradient-to-tr from-brand-dark to-brand px-5 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/submit:translate-x-full"
        />
        <span className="relative">
          {status === "submitting" ? "Sending…" : "Request Free Consultation →"}
        </span>
      </button>

      <AnimatePresence>
        {status === "success" && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#fff3e8] p-3 text-xs leading-relaxed text-[#a94608]"
          >
            Thank you. Your free consultation request was sent to AGUKA
            Financial Group.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#fff0f0] p-3 text-xs leading-relaxed text-[#991b1b]"
          >
            {errorMessage ||
              "We could not send your request. Please email info@agukafinancial.com or call 502-212-0201."}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

function isKnownService(value) {
  return serviceOptions.some((group) => group.options.includes(value));
}
