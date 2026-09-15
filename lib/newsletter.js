import db from "@/lib/db";

export function subscribeEmail(email) {
  db.prepare(`INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)`).run(email);
}

export function listSubscribers() {
  if (!db) return [];
  try {
    return db.prepare(`SELECT * FROM newsletter_subscribers ORDER BY created_at DESC`).all();
  } catch (error) {
    console.error("[newsletter] listSubscribers failed:", error.message);
    return [];
  }
}
