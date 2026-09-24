import pool, { ready, toIso } from "@/lib/db";
import { signValue, verifySignedValue } from "@/lib/auth";
import { normalizeLocale } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/site-url";

export async function subscribeEmail(email, locale) {
  if (!(await ready())) throw new Error("Database is not available.");
  // Re-subscribing just refreshes the language preference.
  await pool.execute(
    `INSERT INTO newsletter_subscribers (email, locale) VALUES (:email, :locale)
     ON DUPLICATE KEY UPDATE locale = VALUES(locale)`,
    { email, locale: normalizeLocale(locale) }
  );
}

export async function listSubscribers() {
  if (!(await ready())) return [];
  try {
    const [rows] = await pool.query(`SELECT * FROM newsletter_subscribers ORDER BY created_at DESC`);
    return rows.map((row) => ({
      ...row,
      locale: normalizeLocale(row.locale),
      created_at: toIso(row.created_at),
    }));
  } catch (error) {
    console.error("[newsletter] listSubscribers failed:", error.message);
    return [];
  }
}

export async function removeSubscriber(email) {
  if (!(await ready())) throw new Error("Database is not available.");
  const [result] = await pool.execute(`DELETE FROM newsletter_subscribers WHERE email = :email`, {
    email,
  });
  return result.affectedRows > 0;
}

export function unsubscribeUrl(email) {
  const base = getSiteUrl();
  const url = new URL("/unsubscribe", base);
  url.searchParams.set("email", email);
  url.searchParams.set("token", signValue(`unsubscribe:${email}`));
  return url.toString();
}

export function verifyUnsubscribeToken(email, token) {
  return verifySignedValue(`unsubscribe:${email}`, token);
}

export async function recordCampaign({ subject, body, subjectRw, bodyRw, recipientCount, sentCount, failedCount }) {
  if (!(await ready())) return;
  await pool.execute(
    `INSERT INTO newsletter_campaigns
      (subject, body, subject_rw, body_rw, recipient_count, sent_count, failed_count)
     VALUES
      (:subject, :body, :subjectRw, :bodyRw, :recipientCount, :sentCount, :failedCount)`,
    {
      subject,
      body,
      subjectRw: subjectRw || null,
      bodyRw: bodyRw || null,
      recipientCount,
      sentCount,
      failedCount,
    }
  );
}

export async function listCampaigns() {
  if (!(await ready())) return [];
  try {
    const [rows] = await pool.query(
      `SELECT * FROM newsletter_campaigns ORDER BY created_at DESC LIMIT 50`
    );
    return rows.map((row) => ({ ...row, created_at: toIso(row.created_at) }));
  } catch (error) {
    console.error("[newsletter] listCampaigns failed:", error.message);
    return [];
  }
}
