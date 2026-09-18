import db from "@/lib/db";

export const LEAD_STATUSES = ["new", "contacted", "in_progress", "done"];

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In progress",
  done: "Done",
};

export function formatStatus(status) {
  return STATUS_LABELS[status] || status;
}

// No hosted database is connected yet, so read paths degrade to empty
// results instead of crashing the whole dashboard (see lib/db.js).
const EMPTY_STATUS_COUNTS = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]));

export function createLead(data) {
  const info = db
    .prepare(
      `INSERT INTO leads
        (first_name, last_name, email, phone, service, preferred_contact, coverage_needs, tax_support, message, attachment_path, attachment_name, status)
       VALUES
        (@firstName, @lastName, @email, @phone, @service, @preferredContact, @coverageNeeds, @taxSupport, @message, @attachmentPath, @attachmentName, 'new')`
    )
    .run({
      message: null,
      attachmentPath: null,
      attachmentName: null,
      ...data,
    });

  const id = info.lastInsertRowid;
  addLeadEvent(id, "note", "Consultation request submitted from the website.");
  return id;
}

const SORT_COLUMNS = {
  name: "first_name COLLATE NOCASE, last_name COLLATE NOCASE",
  service: "service COLLATE NOCASE",
  status: "status",
  created_at: "created_at",
};

export function listLeads({ status, q, sort, dir } = {}) {
  if (!db) return [];
  try {
    const clauses = [];
    const params = [];

    if (status) {
      clauses.push("status = ?");
      params.push(status);
    }

    if (q) {
      clauses.push("(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR service LIKE ?)");
      const like = `%${q}%`;
      params.push(like, like, like, like);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const orderColumn = SORT_COLUMNS[sort] || SORT_COLUMNS.created_at;
    const orderDir = dir === "asc" ? "ASC" : "DESC";

    return db
      .prepare(`SELECT * FROM leads ${where} ORDER BY ${orderColumn} ${orderDir}`)
      .all(...params);
  } catch (error) {
    console.error("[leads] listLeads failed:", error.message);
    return [];
  }
}

export function getLead(id) {
  if (!db) return null;
  try {
    return db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id) || null;
  } catch (error) {
    console.error("[leads] getLead failed:", error.message);
    return null;
  }
}

export function countLeadsByStatus() {
  if (!db) return EMPTY_STATUS_COUNTS;
  try {
    const rows = db.prepare(`SELECT status, COUNT(*) as count FROM leads GROUP BY status`).all();
    const counts = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]));
    for (const row of rows) counts[row.status] = row.count;
    return counts;
  } catch (error) {
    console.error("[leads] countLeadsByStatus failed:", error.message);
    return EMPTY_STATUS_COUNTS;
  }
}

export function updateLeadStatus(id, status, note) {
  if (!LEAD_STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  db.prepare(
    `UPDATE leads SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`
  ).run(status, id);
  addLeadEvent(id, "status_change", note || `Status changed to ${formatStatus(status)}.`);
}

export function addLeadNote(id, note, nextFollowUpAt) {
  db.prepare(
    `UPDATE leads SET next_follow_up_at = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`
  ).run(nextFollowUpAt || null, id);
  addLeadEvent(id, "note", note);
}

export function addLeadEvent(leadId, type, body) {
  db.prepare(`INSERT INTO lead_events (lead_id, type, body) VALUES (?, ?, ?)`).run(
    leadId,
    type,
    body || null
  );
}

export function listLeadEvents(leadId) {
  if (!db) return [];
  try {
    return db
      .prepare(`SELECT * FROM lead_events WHERE lead_id = ? ORDER BY created_at DESC`)
      .all(leadId);
  } catch (error) {
    console.error("[leads] listLeadEvents failed:", error.message);
    return [];
  }
}
