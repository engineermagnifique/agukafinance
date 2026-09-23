import { create, CappedMap } from "altcha-lib/frameworks/nextjs";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

const hmacSignatureSecret = process.env.ALTCHA_HMAC_KEY || "";

// Self-hosted ALTCHA (proof-of-work) protection for the public forms — no
// external account or tracking, unlike reCAPTCHA. Leave ALTCHA_HMAC_KEY
// unset to skip the check entirely (forms still work, just unprotected).
export const altchaEnabled = Boolean(hmacSignatureSecret);

// Tracks challenge nonces that have already been redeemed so a solved
// payload can't be replayed. In-memory only (resets on restart/per
// instance), which is fine here since there's no shared cache in this
// project and the proof-of-work cost is the primary deterrent.
const usedChallenges = altchaEnabled ? new CappedMap({ maxSize: 5000 }) : null;

const instance = altchaEnabled
  ? create({
      createChallengeParameters: () => ({
        algorithm: "PBKDF2/SHA-256",
        cost: 5000,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      }),
      deriveKey,
      hmacSignatureSecret,
      store: usedChallenges,
    })
  : null;

export function altchaChallengeHandler(request) {
  return instance.challengeHandler(request);
}

export async function verifyAltchaPayload(payload) {
  if (!altchaEnabled) return true;
  if (!payload) return false;

  try {
    const result = await instance.verify(
      payload,
      deriveKey,
      hmacSignatureSecret,
      undefined,
      usedChallenges
    );
    return !result.error;
  } catch (error) {
    console.error("[altcha] verification failed", error);
    return false;
  }
}
