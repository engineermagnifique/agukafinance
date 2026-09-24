import crypto from "node:crypto";

export const SESSION_COOKIE_NAME = "aguka_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
export const REMEMBER_MAX_AGE_SECONDS = Math.floor(REMEMBER_TTL_MS / 1000);

// Hardcoded so /dashboard works without configuring Vercel env vars.
// Change these directly (and generate a new hash with scripts/hash-password.mjs)
// whenever you want to rotate the login. An env var, if set, still wins.
const DEFAULT_SESSION_SECRET =
  "78a1795954aa987bfe25d0784fbeb7ee43a3887a1ab1c5fabfa63fb0c109d5ad";
const DEFAULT_ADMIN_EMAIL = "admin@agukafinancial.com";
const DEFAULT_ADMIN_PASSWORD_HASH =
  "630512b23b2ca84ecfd8b272d99645aa:0fe70460bde0a4ead4d2d401b3ef28e7af05364b87ab9559964ac1f9ff61f8940577214b1c0b6f58ab9581996626c025c1333eef1f25521c49bcb2e67c5edd46";

function getSecret() {
  return process.env.SESSION_SECRET || DEFAULT_SESSION_SECRET;
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

// Stateless signatures for links sent by email (e.g. newsletter unsubscribe),
// so the link can be verified without storing a token per subscriber.
export function signValue(value) {
  return sign(`link:v1:${value}`);
}

export function verifySignedValue(value, signature) {
  if (typeof value !== "string" || typeof signature !== "string" || !signature) return false;
  return timingSafeStringEqual(signature, signValue(value));
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
  const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const stored = process.env.ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_PASSWORD_HASH;
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
