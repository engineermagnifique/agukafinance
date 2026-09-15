import db from "@/lib/db";

export const VISITOR_RANGES = ["7d", "30d", "all"];

const EMPTY_STATS = {
  totals: { views: 0, visitors: 0 },
  today: { views: 0, visitors: 0 },
  daily: [],
  currentPeriod: { views: 0, visitors: 0 },
  previousPeriod: null,
  topPages: [],
  topReferrers: [],
  recent: [],
};

export function recordPageView({ path, referrer, visitorId, userAgent }) {
  if (!db) return;
  db.prepare(
    `INSERT INTO page_views (path, referrer, visitor_id, user_agent) VALUES (?, ?, ?, ?)`
  ).run(path, referrer || null, visitorId, userAgent || null);
}

export function getVisitorStats({ range = "7d" } = {}) {
  if (!db) return { range, ...EMPTY_STATS };
  try {
    return getVisitorStatsFromDb(range);
  } catch (error) {
    console.error("[visitors] getVisitorStats failed:", error.message);
    return { range, ...EMPTY_STATS };
  }
}

function getVisitorStatsFromDb(range) {
  const totals = db
    .prepare(`SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors FROM page_views`)
    .get();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const today = db
    .prepare(
      `SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors FROM page_views WHERE created_at >= ?`
    )
    .get(todayStart.toISOString());

  const rangeDays = range === "7d" ? 7 : range === "30d" ? 30 : null;
  const since =
    rangeDays !== null
      ? new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString()
      : getEarliestCreatedAt() || new Date().toISOString();
  const days = Math.max(
    1,
    Math.ceil((Date.now() - new Date(since).getTime()) / (24 * 60 * 60 * 1000)) + 1
  );

  const currentPeriod = queryPeriodTotals(since, null);
  const previousPeriod = rangeDays
    ? queryPeriodTotals(new Date(Date.now() - rangeDays * 2 * 24 * 60 * 60 * 1000).toISOString(), since)
    : null;

  const dailyRows = db
    .prepare(
      `SELECT substr(created_at, 1, 10) as day, COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors
       FROM page_views
       WHERE created_at >= ?
       GROUP BY day
       ORDER BY day ASC`
    )
    .all(since);

  const daily = fillMissingDays(dailyRows, days);

  const topPages = db
    .prepare(
      `SELECT path, COUNT(*) as views
       FROM page_views
       WHERE created_at >= ?
       GROUP BY path
       ORDER BY views DESC
       LIMIT 10`
    )
    .all(since);

  const topReferrers = db
    .prepare(
      `SELECT CASE WHEN referrer IS NULL OR referrer = '' THEN 'Direct' ELSE referrer END as referrer,
              COUNT(*) as views
       FROM page_views
       WHERE created_at >= ?
       GROUP BY referrer
       ORDER BY views DESC
       LIMIT 10`
    )
    .all(since);

  const recent = db
    .prepare(
      `SELECT path, referrer, visitor_id, user_agent, created_at
       FROM page_views
       WHERE created_at >= ?
       ORDER BY created_at DESC
       LIMIT 25`
    )
    .all(since)
    .map((row) => ({ ...row, device: parseUserAgent(row.user_agent) }));

  return { range, totals, today, daily, currentPeriod, previousPeriod, topPages, topReferrers, recent };
}

function queryPeriodTotals(since, until) {
  const clauses = [];
  const params = [];
  if (since) {
    clauses.push("created_at >= ?");
    params.push(since);
  }
  if (until) {
    clauses.push("created_at < ?");
    params.push(until);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors FROM page_views ${where}`)
    .get(...params);
}

function getEarliestCreatedAt() {
  const row = db.prepare(`SELECT MIN(created_at) as first FROM page_views`).get();
  return row?.first || null;
}

// Lightweight, dependency-free user-agent summary — good enough for "what
// browser/device is this visitor on", not full device detection.
function parseUserAgent(userAgent) {
  if (!userAgent) return "Unknown";

  let browser = "Unknown browser";
  if (/Edg\//.test(userAgent)) browser = "Edge";
  else if (/OPR\//.test(userAgent)) browser = "Opera";
  else if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent)) browser = "Chrome";
  else if (/CriOS/.test(userAgent)) browser = "Chrome";
  else if (/Firefox\//.test(userAgent)) browser = "Firefox";
  else if (/Safari\//.test(userAgent) && /Version\//.test(userAgent)) browser = "Safari";

  let os = "Unknown OS";
  if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";
  else if (/Android/.test(userAgent)) os = "Android";
  else if (/Windows/.test(userAgent)) os = "Windows";
  else if (/Mac OS X/.test(userAgent)) os = "macOS";
  else if (/Linux/.test(userAgent)) os = "Linux";

  return `${browser} · ${os}`;
}

export function percentChange(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

function fillMissingDays(rows, days) {
  const byDay = new Map(rows.map((row) => [row.day, row]));
  const result = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const day = date.toISOString().slice(0, 10);
    const existing = byDay.get(day);
    result.push({ day, views: existing?.views ?? 0, visitors: existing?.visitors ?? 0 });
  }
  return result;
}
