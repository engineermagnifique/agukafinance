import pool, { ready, toIso } from "@/lib/db";

export async function subscribeEmail(email) {
  if (!(await ready())) throw new Error("Database is not available.");
  await pool.execute(`INSERT IGNORE INTO newsletter_subscribers (email) VALUES (:email)`, { email });
}

export async function listSubscribers() {
  if (!(await ready())) return [];
  try {
    const [rows] = await pool.query(`SELECT * FROM newsletter_subscribers ORDER BY created_at DESC`);
    return rows.map((row) => ({ ...row, created_at: toIso(row.created_at) }));
  } catch (error) {
    console.error("[newsletter] listSubscribers failed:", error.message);
    return [];
  }
}
