import pool, { ready, toIso } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n/config";

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

const LEAD_COLUMNS = `
  id, first_name, last_name, email, phone, service, preferred_contact,
  coverage_needs, tax_support, message, attachment_name, attachment_type,
  status, next_follow_up_at, locale, created_at, updated_at
`;

function parseLeadRow(row) {
  if (!row) return row;
  return {
    ...row,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
    next_follow_up_at: row.next_follow_up_at ? toIso(row.next_follow_up_at) : null,
    locale: normalizeLocale(row.locale),
  };
}

export async function createLead(data) {
  if (!(await ready())) throw new Error("Database is not available.");

  const [result] = await pool.execute(
    `INSERT INTO leads
      (first_name, last_name, email, phone, service, preferred_contact, coverage_needs, tax_support, message, attachment_name, attachment_type, attachment_data, locale, status)
     VALUES
      (:firstName, :lastName, :email, :phone, :service, :preferredContact, :coverageNeeds, :taxSupport, :message, :attachmentName, :attachmentType, :attachmentData, :locale, 'new')`,
    {
      message: null,
      attachmentName: null,
      attachmentType: null,
      attachmentData: null,
      ...data,
      locale: normalizeLocale(data.locale),
    }
  );

  const id = result.insertId;
  await addLeadEvent(id, "note", "Consultation request submitted from the website.");
  return id;
}

const SORT_COLUMNS = {
  name: "first_name, last_name",
  service: "service",
  status: "status",
  created_at: "created_at",
};

export async function listLeads({ status, q, sort, dir } = {}) {
  if (!(await ready())) return [];
  try {
    const clauses = [];
    const params = {};

    if (status) {
      clauses.push("status = :status");
      params.status = status;
    }

    if (q) {
      clauses.push(
        "(first_name LIKE :q OR last_name LIKE :q OR email LIKE :q OR service LIKE :q)"
      );
      params.q = `%${q}%`;
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const orderColumn = SORT_COLUMNS[sort] || SORT_COLUMNS.created_at;
    const orderDir = dir === "asc" ? "ASC" : "DESC";

    const [rows] = await pool.execute(
      `SELECT ${LEAD_COLUMNS} FROM leads ${where} ORDER BY ${orderColumn} ${orderDir}`,
      params
    );
    return rows.map(parseLeadRow);
  } catch (error) {
    console.error("[leads] listLeads failed:", error.message);
    return [];
  }
}

export async function getLead(id) {
  if (!(await ready())) return null;
  try {
    const [rows] = await pool.execute(`SELECT ${LEAD_COLUMNS} FROM leads WHERE id = :id`, { id });
    return rows[0] ? parseLeadRow(rows[0]) : null;
  } catch (error) {
    console.error("[leads] getLead failed:", error.message);
    return null;
  }
}

export async function getLeadAttachment(id) {
  if (!(await ready())) return null;
  try {
    const [rows] = await pool.execute(
      `SELECT attachment_name, attachment_type, attachment_data FROM leads WHERE id = :id`,
      { id }
    );
    const row = rows[0];
    if (!row || !row.attachment_data) return null;
    return {
      name: row.attachment_name,
      type: row.attachment_type,
      data: row.attachment_data,
    };
  } catch (error) {
    console.error("[leads] getLeadAttachment failed:", error.message);
    return null;
  }
}

export async function countLeadsByStatus() {
  if (!(await ready())) return EMPTY_STATUS_COUNTS;
  try {
    const [rows] = await pool.query(`SELECT status, COUNT(*) as count FROM leads GROUP BY status`);
    const counts = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]));
    for (const row of rows) counts[row.status] = row.count;
    return counts;
  } catch (error) {
    console.error("[leads] countLeadsByStatus failed:", error.message);
    return EMPTY_STATUS_COUNTS;
  }
}

export async function updateLeadStatus(id, status, note) {
  if (!LEAD_STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  if (!(await ready())) throw new Error("Database is not available.");
  await pool.execute(`UPDATE leads SET status = :status WHERE id = :id`, { status, id });
  await addLeadEvent(id, "status_change", note || `Status changed to ${formatStatus(status)}.`);
}

export async function addLeadNote(id, note, nextFollowUpAt) {
  if (!(await ready())) throw new Error("Database is not available.");
  await pool.execute(`UPDATE leads SET next_follow_up_at = :nextFollowUpAt WHERE id = :id`, {
    nextFollowUpAt: nextFollowUpAt || null,
    id,
  });
  await addLeadEvent(id, "note", note);
}

export async function addLeadEvent(leadId, type, body) {
  if (!(await ready())) throw new Error("Database is not available.");
  await pool.execute(`INSERT INTO lead_events (lead_id, type, body) VALUES (:leadId, :type, :body)`, {
    leadId,
    type,
    body: body || null,
  });
}

export async function listLeadEvents(leadId) {
  if (!(await ready())) return [];
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM lead_events WHERE lead_id = :leadId ORDER BY created_at DESC`,
      { leadId }
    );
    return rows.map((row) => ({ ...row, created_at: toIso(row.created_at) }));
  } catch (error) {
    console.error("[leads] listLeadEvents failed:", error.message);
    return [];
  }
}
