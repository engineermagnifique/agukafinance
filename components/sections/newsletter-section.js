"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Eyebrow from "@/components/ui/eyebrow";
import Altcha from "@/components/ui/altcha";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const altchaRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, altcha: captchaToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setStatus("success");
      setEmail("");
      setCaptchaToken("");
      altchaRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not subscribe you. Please try again."
      );
    }
  }

  return (
    <section className="relative mb-10 overflow-hidden bg-white py-16 sm:mb-14 sm:py-20">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative w-full overflow-hidden rounded-2xl bg-navy px-6 py-14 text-center text-white shadow-[0_30px_60px_-15px_rgba(1,31,72,0.4)] sm:px-12 sm:py-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border-[10px] border-white/30 bg-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full border-[30px] border-white/30 bg-transparent"
          />

          <div className="relative flex flex-col items-center gap-6">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-gold">
              <Mail size={24} />
            </span>

            <div>
              <Eyebrow align="center" tone="gold">
                STAY INFORMED
              </Eyebrow>
              <h2 className="mt-3 text-[clamp(26px,3.6vw,38px)] font-bold leading-[1.15]">
                <span className="block">Stay updated in your inbox</span>
                <span className="block">with AGUKA Financial</span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
                Stay informed with AGUKA Financial Group services.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={160}
                className="w-full rounded-[3px] border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-gold focus:bg-white/15 focus:ring-2 focus:ring-gold/30"
              />
              <label
                className="absolute left-[-10000px] h-px w-px overflow-hidden"
                aria-hidden="true"
              >
                Leave this field empty
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="group/submit relative shrink-0 overflow-hidden rounded-[3px] bg-gradient-to-tr from-brand-dark to-brand px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/submit:translate-x-full"
                />
                <span className="relative">
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                </span>
              </button>
            </form>

            <Altcha
              ref={altchaRef}
              onChange={setCaptchaToken}
              className="[&_altcha-widget]:mx-auto"
            />

            {status === "success" && (
              <motion.p
                role="status"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-medium text-gold"
              >
                Thanks for subscribing!
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                role="status"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-medium text-red-300"
              >
                {errorMessage}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
