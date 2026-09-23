"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "altcha";

// Renders the self-hosted ALTCHA proof-of-work widget (no external account
// or tracking, unlike reCAPTCHA) and reports the verified payload via
// onChange. The widget solves its challenge invisibly in the background
// (auto="onload"), so by the time a visitor submits the form it has
// usually already verified.
//
// The <altcha-widget> custom element mutates its own DOM the instant the
// browser parses it (before React hydrates), which causes a hydration
// mismatch and destroys the in-flight challenge solve. Mounting it only
// after the component is client-side avoids that entirely.
const Altcha = forwardRef(function Altcha({ onChange, className }, ref) {
  const widgetRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useImperativeHandle(ref, () => ({
    reset: () => widgetRef.current?.reset(),
  }));

  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return undefined;

    function handleStateChange(event) {
      const { state, payload } = event.detail || {};
      onChange(state === "verified" && payload ? payload : "");
    }

    el.addEventListener("statechange", handleStateChange);
    return () => el.removeEventListener("statechange", handleStateChange);
  }, [onChange, mounted]);

  return (
    <div className={className}>
      {mounted && (
        <altcha-widget
          ref={widgetRef}
          challenge="/api/altcha/challenge"
          auto="onload"
          hidefooter=""
        />
      )}
    </div>
  );
});

export default Altcha;
