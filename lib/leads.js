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

export function createLead(data) {
  const info = db
    .prepare(
      `INSERT INTO leads
        (first_name, last_name, email, phone, service, preferred_contact, coverage_needs, tax_support, status)
       VALUES
        (@firstName, @lastName, @email, @phone, @service, @preferredContact, @coverageNeeds, @taxSupport, 'new')`
    )
    .run(data);

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
}

export function getLead(id) {
  return db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id) || null;
}

export function countLeadsByStatus() {
  const rows = db.prepare(`SELECT status, COUNT(*) as count FROM leads GROUP BY status`).all();
  const counts = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]));
  for (const row of rows) counts[row.status] = row.count;
  return counts;
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
  return db
    .prepare(`SELECT * FROM lead_events WHERE lead_id = ? ORDER BY created_at DESC`)
    .all(leadId);
}
