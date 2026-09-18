"use client";

import { useEffect, useId, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
const SCRIPT_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

let scriptPromise = null;

function loadRecaptchaScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve(window.grecaptcha);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.grecaptcha);
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA."));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Renders a Google reCAPTCHA v2 checkbox and reports the verification token
// via onChange. If no site key is configured (NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
// the widget quietly doesn't render so the form still works without it.
export default function Recaptcha({ onChange }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);
  const elementId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!SITE_KEY) return undefined;
    let cancelled = false;

    loadRecaptchaScript()
      .then((grecaptcha) => {
        if (cancelled || !containerRef.current || widgetId.current !== null) return;
        grecaptcha.ready(() => {
          if (cancelled || !containerRef.current) return;
          widgetId.current = grecaptcha.render(containerRef.current, {
            sitekey: SITE_KEY,
            callback: (token) => onChange(token),
            "expired-callback": () => onChange(""),
            "error-callback": () => onChange(""),
          });
        });
      })
      .catch((error) => console.error("[recaptcha]", error.message));

    return () => {
      cancelled = true;
    };
  }, [onChange]);

  if (!SITE_KEY) return null;

  return <div id={elementId} ref={containerRef} className="[&>div]:mx-auto" />;
}

export const recaptchaEnabled = Boolean(SITE_KEY);
