"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, X } from "lucide-react";
import Eyebrow from "@/components/ui/eyebrow";
import Recaptcha, { recaptchaEnabled } from "@/components/ui/recaptcha";
import {
  attachmentAccept,
  attachmentMaxBytes,
  financialInterestOptions,
  insuranceInterestOptions,
  preferredContactOptions,
  taxSupportOptions,
} from "@/lib/site-config";

const initialState = {
  interests: [],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  coverageNeeds: "",
  taxSupport: taxSupportOptions[0],
  preferredContact: preferredContactOptions[0],
  message: "",
  website: "",
  consent: false,
};

const fieldClass =
  "w-full rounded-[3px] border border-gray-300 bg-cream px-3.5 py-3 text-[13px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

const labelClass = "flex flex-col gap-1.5 text-[11px] font-semibold text-ink";

const checkboxRowClass =
  "flex items-center gap-2.5 text-[13px] font-medium text-ink";

// Maps a service value coming from elsewhere on the site (e.g. "Auto & Home:
// Homeowners" from a coverage accordion, or "Commercial Lines") onto the
// checkbox groups this form now uses for "Service of interest".
function mapServiceToInterests(service) {
  if (!service) return [];
  const [category] = service.split(":").map((part) => part.trim());

  if (category === "Life") return ["Life"];
  if (category === "Auto & Home") return ["Auto", "Home"];
  if (category === "Commercial Lines") return ["Commercial Lines"];
  if (category === "Tax Services" || category === "Tax & Financial Services") {
    return ["Income Tax Preparation"];
  }
  if (category === "Mortgage Support") return ["Mortgage Pre-Approval Support"];
  if (category === "Others") return ["Others"];
  return [];
}

export default function ConsultationForm({ initialService = null, className }) {
  const searchParams = useSearchParams();
  const prefillService = initialService ?? searchParams.get("service");

  const [values, setValues] = useState(() => ({
    ...initialState,
    interests: mapServiceToInterests(prefillService),
  }));
  const [appliedPrefill, setAppliedPrefill] = useState(prefillService);
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (prefillService !== appliedPrefill && prefillService) {
    setAppliedPrefill(prefillService);
    setValues((prev) => ({ ...prev, interests: mapServiceToInterests(prefillService) }));
  }

  const showCoverage = useMemo(
    () => values.interests.some((interest) => insuranceInterestOptions.includes(interest)),
    [values.interests]
  );
  const showTaxSupport = values.interests.includes("Income Tax Preparation");

  function update(field) {
    return (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function toggleInterest(interest) {
    return (event) => {
      setValues((prev) => ({
        ...prev,
        interests: event.target.checked
          ? [...prev.interests, interest]
          : prev.interests.filter((item) => item !== interest),
      }));
    };
  }

  const handleCaptchaChange = useCallback((token) => setCaptchaToken(token), []);

  function handleAttachmentChange(event) {
    const file = event.target.files?.[0] || null;
    setAttachmentError("");

    if (!file) {
      setAttachment(null);
      return;
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      setAttachmentError("Attachments must be a PDF, PNG or JPEG file.");
      event.target.value = "";
      setAttachment(null);
      return;
    }

    if (file.size > attachmentMaxBytes) {
      setAttachmentError("Attachments must be 5MB or smaller.");
      event.target.value = "";
      setAttachment(null);
      return;
    }

    setAttachment(file);
  }

  function removeAttachment() {
    setAttachment(null);
    setAttachmentError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData();
    const service = values.interests.length > 0 ? values.interests.join(", ") : "General Consultation";
    formData.set("service", service);
    formData.set("firstName", values.firstName);
    formData.set("lastName", values.lastName);
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("coverageNeeds", values.coverageNeeds);
    formData.set("taxSupport", values.taxSupport);
    formData.set("preferredContact", values.preferredContact);
    formData.set("message", values.message);
    formData.set("website", values.website);
    formData.set("consent", String(values.consent));
    formData.set("captchaToken", captchaToken);
    if (attachment) formData.set("attachment", attachment);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setStatus("success");
      setValues(initialState);
      setAttachment(null);
      setCaptchaToken("");
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

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-[11px] font-semibold text-ink">
          Insurances
        </legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {insuranceInterestOptions.map((option) => (
            <label key={option} className={checkboxRowClass}>
              <input
                type="checkbox"
                checked={values.interests.includes(option)}
                onChange={toggleInterest(option)}
                className="h-4 w-4 shrink-0 accent-brand"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-[11px] font-semibold text-ink">
          Financial Services
        </legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {financialInterestOptions.map((option) => (
            <label key={option} className={checkboxRowClass}>
              <input
                type="checkbox"
                checked={values.interests.includes(option)}
                onChange={toggleInterest(option)}
                className="h-4 w-4 shrink-0 accent-brand"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <label className={labelClass}>
          Anything else we should know?
          <textarea
            rows={1}
            maxLength={1000}
            placeholder="Optional — add any extra details."
            className={`${fieldClass} resize-y`}
            value={values.message}
            onChange={update("message")}
          />
        </label>
      </div>

      <div className={labelClass}>
        Attach a file (optional)
        <p className="text-[11px] font-normal text-muted">
          PDF, PNG or JPEG, up to 5MB.
        </p>
        {attachment ? (
          <div className="flex items-center justify-between gap-2 rounded-[3px] border border-gray-300 bg-cream px-3.5 py-2.5 text-[13px] text-ink">
            <span className="flex items-center gap-2 truncate">
              <Paperclip size={14} className="shrink-0 text-brand" />
              <span className="truncate">{attachment.name}</span>
            </span>
            <button
              type="button"
              onClick={removeAttachment}
              aria-label="Remove attachment"
              className="shrink-0 text-muted transition-colors hover:text-brand"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept={attachmentAccept}
            onChange={handleAttachmentChange}
            className="w-full rounded-[3px] border border-gray-300 bg-cream px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors file:mr-3 file:rounded-[3px] file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        )}
        {attachmentError && (
          <p className="text-[11px] font-medium text-[#991b1b]">{attachmentError}</p>
        )}
      </div>

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
          onChange={(event) =>
            setValues((prev) => ({ ...prev, consent: event.target.checked }))
          }
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />
        <span>
          I agree to be contacted about my request. Submitting this form
          does not create a client relationship or guarantee eligibility,
          coverage, rates, or tax outcomes.
        </span>
      </label>

      {recaptchaEnabled && <Recaptcha onChange={handleCaptchaChange} />}

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
