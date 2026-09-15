import crypto from "node:crypto";

export const SESSION_COOKIE_NAME = "aguka_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
export const REMEMBER_MAX_AGE_SECONDS = Math.floor(REMEMBER_TTL_MS / 1000);

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Copy .env.example to .env.local and fill it in."
    );
  }
  return secret;
}

function sign(encodedPayload) {
  return crypto.createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");
}

function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createSessionToken(email, ttlMs = SESSION_TTL_MS) {
  const payload = JSON.stringify({ email, exp: Date.now() + ttlMs });
  const encoded = Buffer.from(payload, "utf8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  let expected;
  try {
    expected = sign(encoded);
  } catch {
    return null;
  }

  if (!timingSafeStringEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !stored || !email || !password) return false;

  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const emailMatches = timingSafeStringEqual(
    email.trim().toLowerCase(),
    adminEmail.trim().toLowerCase()
  );

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = crypto.scryptSync(password, salt, expected.length);
  const passwordMatches = derived.length === expected.length && crypto.timingSafeEqual(derived, expected);

  return emailMatches && passwordMatches;
}
