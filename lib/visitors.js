import pool, { ready, toIso } from "@/lib/db";

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

export async function recordPageView({ path, referrer, visitorId, userAgent }) {
  if (!(await ready())) return;
  await pool.execute(
    `INSERT INTO page_views (path, referrer, visitor_id, user_agent) VALUES (:path, :referrer, :visitorId, :userAgent)`,
    { path, referrer: referrer || null, visitorId, userAgent: userAgent || null }
  );
}

export async function getVisitorStats({ range = "7d" } = {}) {
  if (!(await ready())) return { range, ...EMPTY_STATS };
  try {
    return await getVisitorStatsFromDb(range);
  } catch (error) {
    console.error("[visitors] getVisitorStats failed:", error.message);
    return { range, ...EMPTY_STATS };
  }
}

async function getVisitorStatsFromDb(range) {
  const [[totals]] = await pool.query(
    `SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors FROM page_views`
  );

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const [[today]] = await pool.execute(
    `SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors FROM page_views WHERE created_at >= :since`,
    { since: mysqlDatetime(todayStart) }
  );

  const rangeDays = range === "7d" ? 7 : range === "30d" ? 30 : null;
  const since =
    rangeDays !== null
      ? new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000)
      : (await getEarliestCreatedAt()) || new Date();
  const days = Math.max(1, Math.ceil((Date.now() - since.getTime()) / (24 * 60 * 60 * 1000)) + 1);

  const currentPeriod = await queryPeriodTotals(since, null);
  const previousPeriod = rangeDays
    ? await queryPeriodTotals(new Date(Date.now() - rangeDays * 2 * 24 * 60 * 60 * 1000), since)
    : null;

  const [dailyRows] = await pool.execute(
    `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as day, COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors
     FROM page_views
     WHERE created_at >= :since
     GROUP BY day
     ORDER BY day ASC`,
    { since: mysqlDatetime(since) }
  );

  const daily = fillMissingDays(dailyRows, days);

  const [topPages] = await pool.execute(
    `SELECT path, COUNT(*) as views
     FROM page_views
     WHERE created_at >= :since
     GROUP BY path
     ORDER BY views DESC
     LIMIT 10`,
    { since: mysqlDatetime(since) }
  );

  const [topReferrers] = await pool.execute(
    `SELECT CASE WHEN referrer IS NULL OR referrer = '' THEN 'Direct' ELSE referrer END as referrer,
            COUNT(*) as views
     FROM page_views
     WHERE created_at >= :since
     GROUP BY referrer
     ORDER BY views DESC
     LIMIT 10`,
    { since: mysqlDatetime(since) }
  );

  const [recentRows] = await pool.execute(
    `SELECT path, referrer, visitor_id, user_agent, created_at
     FROM page_views
     WHERE created_at >= :since
     ORDER BY created_at DESC
     LIMIT 25`,
    { since: mysqlDatetime(since) }
  );
  const recent = recentRows.map((row) => ({
    ...row,
    created_at: toIso(row.created_at),
    device: parseUserAgent(row.user_agent),
  }));

  return { range, totals, today, daily, currentPeriod, previousPeriod, topPages, topReferrers, recent };
}

async function queryPeriodTotals(since, until) {
  const clauses = [];
  const params = {};
  if (since) {
    clauses.push("created_at >= :since");
    params.since = mysqlDatetime(since);
  }
  if (until) {
    clauses.push("created_at < :until");
    params.until = mysqlDatetime(until);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const [[row]] = await pool.execute(
    `SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors FROM page_views ${where}`,
    params
  );
  return row;
}

async function getEarliestCreatedAt() {
  const [[row]] = await pool.query(`SELECT MIN(created_at) as first FROM page_views`);
  return row?.first ? new Date(`${row.first.replace(" ", "T")}Z`) : null;
}

// The pool is configured with timezone "Z", so JS Date objects convert to
// UTC "YYYY-MM-DD HH:MM:SS" for MySQL comparisons.
function mysqlDatetime(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
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
