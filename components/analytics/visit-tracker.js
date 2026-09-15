"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCookieConsent } from "@/lib/cookie-consent";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (getCookieConsent() === "rejected") return;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
