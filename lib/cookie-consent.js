const COOKIE_NAME = "aguka_cookie_consent";
const MAX_AGE_DAYS = 180;

export function getCookieConsent() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookieConsent(value) {
  if (typeof document === "undefined") return;
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}
