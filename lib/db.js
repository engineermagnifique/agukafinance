import mysql from "mysql2/promise";
import {
  lifeInsuranceApplyUrl,
  autoHomeCoverage,
  commercialLinesCoverage,
  commercialLinesQuoteUrl,
  mortgagePortalUrl,
} from "@/lib/site-config";
import { SERVICE_TRANSLATIONS_RW } from "@/lib/service-translations";

const globalForDb = globalThis;

const commercialLinesDescription = `Fill out a quick form and submit it to our team. We'll compare coverage and rates from leading commercial insurance carriers to find the right protection for your business. No obligation, no pressure, and no hidden fees. We never sell your information, and you'll never receive cold calls or spam from us, guaranteed. Coverage includes ${commercialLinesCoverage.join(", ")}.`;

function buildPoolConfig() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) return null;

  return {
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : 3306,
    user: DB_USER,
    password: DB_PASSWORD || "",
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    dateStrings: true,
    namedPlaceholders: true,
    ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
  };
}

function createPool() {
  const config = buildPoolConfig();
  if (!config) return null;
  try {
    const newPool = mysql.createPool(config);
    // Hostinger's MySQL session timezone depends on server config, which we
    // don't control. Force every pooled connection to UTC so CURRENT_TIMESTAMP
    // / NOW() line up with the UTC math the app does in JS (page-view range
    // filters, "today" boundaries, etc.) — mirrors the guarantee the old
    // SQLite strftime(...,'Z') calls gave us.
    newPool.on("connection", (connection) => {
      connection.query("SET time_zone = '+00:00'");
    });
    return newPool;
  } catch (error) {
    // Hostinger's MySQL host may not be configured yet (e.g. fresh checkout,
    // or a build/preview environment without DB env vars) — degrade instead
    // of crashing every route that imports this module.
    console.error("[db] could not create MySQL pool, falling back to unavailable mode:", error.message);
    return null;
  }
}

const pool = globalForDb.__agukaPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalForDb.__agukaPool = pool;
}

export const isDbAvailable = pool !== null;

async function runMigrations(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(64) NOT NULL DEFAULT 'Shield',
      cta_type VARCHAR(32) NOT NULL DEFAULT 'info',
      cta_label VARCHAR(255) NULL,
      cta_href VARCHAR(500) NULL,
      accordion_items TEXT NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(120) NOT NULL,
      last_name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(60) NOT NULL,
      service VARCHAR(255) NOT NULL,
      preferred_contact VARCHAR(60) NULL,
      coverage_needs TEXT NULL,
      tax_support VARCHAR(255) NULL,
      message TEXT NULL,
      attachment_name VARCHAR(255) NULL,
      attachment_type VARCHAR(100) NULL,
      attachment_data LONGBLOB NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'new',
      next_follow_up_at DATETIME NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_leads_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lead_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      type VARCHAR(32) NOT NULL,
      body TEXT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_lead_events_lead_id (lead_id),
      CONSTRAINT fk_lead_events_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS page_views (
      id INT AUTO_INCREMENT PRIMARY KEY,
      path VARCHAR(500) NOT NULL,
      referrer VARCHAR(500) NULL,
      visitor_id VARCHAR(64) NOT NULL,
      user_agent VARCHAR(500) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_page_views_created_at (created_at),
      INDEX idx_page_views_visitor_id (visitor_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Tracks one-time content refreshes (see refreshServiceContent) so a
  // restart doesn't re-overwrite services an admin has since edited.
  await conn.query(`
    CREATE TABLE IF NOT EXISTS service_content_syncs (
      version VARCHAR(64) PRIMARY KEY,
      applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Newsletters sent from the dashboard, kept as a history log.
  await conn.query(`
    CREATE TABLE IF NOT EXISTS newsletter_campaigns (
      id INT AUTO_INCREMENT PRIMARY KEY,
      subject VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      subject_rw VARCHAR(255) NULL,
      body_rw TEXT NULL,
      recipient_count INT NOT NULL DEFAULT 0,
      sent_count INT NOT NULL DEFAULT 0,
      failed_count INT NOT NULL DEFAULT 0,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Kinyarwanda support: translated service copy, plus the language each
  // client / subscriber used so emails to them go out in that language.
  await addColumnIfMissing(conn, "services", "title_rw", "VARCHAR(255) NULL");
  await addColumnIfMissing(conn, "services", "description_rw", "TEXT NULL");
  await addColumnIfMissing(conn, "services", "cta_label_rw", "VARCHAR(255) NULL");
  await addColumnIfMissing(conn, "services", "accordion_items_rw", "TEXT NULL");
  await addColumnIfMissing(conn, "leads", "locale", "VARCHAR(8) NOT NULL DEFAULT 'en'");
  await addColumnIfMissing(
    conn,
    "newsletter_subscribers",
    "locale",
    "VARCHAR(8) NOT NULL DEFAULT 'en'"
  );
}

// MySQL has no portable "ADD COLUMN IF NOT EXISTS", so check the schema first.
async function addColumnIfMissing(conn, table, column, definition) {
  const [[row]] = await conn.execute(
    `SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column`,
    { table, column }
  );
  if (row.count > 0) return;
  await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
}

// Mirrors lib/services.js's FALLBACK_SERVICES. Kept in sync manually since
// this file seeds new installs and lib/services.js covers db-unavailable
// reads — see refreshServiceContent() for how existing databases catch up.
const SERVICE_DEFAULTS = [
  {
    title: "Life",
    description:
      "Compare real life insurance quotes instantly from top-rated carriers in minutes. No phone number or email required, guaranteed. No spam emails, no telemarketing calls, and no obligation. When you're ready, apply online and receive approval in minutes on select policies.",
    icon: "Heart",
    ctaType: "apply",
    ctaLabel: "Apply for life insurance",
    ctaHref: lifeInsuranceApplyUrl,
    accordionItems: null,
    isActive: 1,
    sortOrder: 0,
  },
  {
    title: "Auto & Home",
    description:
      "Complete a quick form and let our licensed agents do the work. We'll compare rates from leading insurance carriers and provide personalized Auto & Home Insurance quotes tailored to your needs and budget. No obligation, no pressure, and no hidden fees. We never sell your information, and you'll never receive cold calls or spam from us, guaranteed.",
    icon: "Home",
    ctaType: "accordion",
    ctaLabel: "View coverage options",
    ctaHref: null,
    accordionItems: JSON.stringify(autoHomeCoverage),
    isActive: 1,
    sortOrder: 1,
  },
  {
    title: "Commercial Lines",
    description: commercialLinesDescription,
    icon: "Building2",
    ctaType: "apply",
    ctaLabel: "Get a Business Quote",
    ctaHref: commercialLinesQuoteUrl,
    accordionItems: null,
    isActive: 1,
    sortOrder: 2,
  },
  {
    title: "Tax & Financial Services",
    description:
      "Enjoy our year-round income tax preparation and support services. Our fixed fees mean no surprises. We stand behind our work with an IRS compliance and accuracy guarantee letter for your peace of mind, at no additional charge.",
    icon: "Landmark",
    ctaType: "info",
    ctaLabel: "Compare Income Tax Prep Fee",
    ctaHref: null,
    accordionItems: null,
    isActive: 1,
    sortOrder: 3,
  },
  {
    title: "Mortgage Support",
    description:
      "Explore mortgage support services provided by a licensed mortgage loan originator acting through an approved mortgage broker company (NMLS #320841). Clicking the link below will redirect you to a third-party portal and you're subject to their privacy terms and conditions.",
    icon: "HandCoins",
    ctaType: "apply",
    ctaLabel: "Get a Free Quote",
    ctaHref: mortgagePortalUrl,
    accordionItems: null,
    isActive: 1,
    sortOrder: 4,
  },
];

// Bump this when SERVICE_DEFAULTS' wording changes and the update should be
// pushed to already-seeded databases again.
const SERVICE_CONTENT_VERSION = "2026-09-17-comments-round-2";

async function seedServices(conn) {
  const [[{ count }]] = await conn.query("SELECT COUNT(*) as count FROM services");
  if (count > 0) return;

  for (const row of SERVICE_DEFAULTS) {
    await conn.execute(
      `INSERT INTO services
        (title, description, icon, cta_type, cta_label, cta_href, accordion_items, is_active, sort_order)
       VALUES
        (:title, :description, :icon, :ctaType, :ctaLabel, :ctaHref, :accordionItems, :isActive, :sortOrder)`,
      row
    );
  }
}

// Keeps a previously-seeded database's copy in sync with the latest approved
// wording (from the AGUKA website comments) so the pre-launch site reflects
// the latest approved copy even though it was originally seeded earlier.
async function refreshServiceContent(conn) {
  const [[syncRow]] = await conn.execute(
    `SELECT COUNT(*) as count FROM service_content_syncs WHERE version = :version`,
    { version: SERVICE_CONTENT_VERSION }
  );
  if (syncRow.count > 0) return;

  const [existingRows] = await conn.query(`SELECT title FROM services`);
  const existingTitles = new Set(existingRows.map((row) => row.title));

  // "Personal Lines" was renamed to "Auto & Home" with a narrower coverage
  // list — update it in place so it keeps its sort position instead of
  // duplicating as a new row.
  if (existingTitles.has("Personal Lines") && !existingTitles.has("Auto & Home")) {
    await conn.query(`UPDATE services SET title = 'Auto & Home' WHERE title = 'Personal Lines'`);
    existingTitles.delete("Personal Lines");
    existingTitles.add("Auto & Home");
  }

  const [[{ maxOrder }]] = await conn.query(
    `SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM services`
  );
  let nextSortOrder = maxOrder + 1;

  for (const row of SERVICE_DEFAULTS) {
    if (existingTitles.has(row.title)) {
      await conn.execute(
        `UPDATE services SET
          description = :description, icon = :icon, cta_type = :ctaType,
          cta_label = :ctaLabel, cta_href = :ctaHref, accordion_items = :accordionItems
         WHERE title = :title`,
        row
      );
    } else {
      await conn.execute(
        `INSERT INTO services
          (title, description, icon, cta_type, cta_label, cta_href, accordion_items, is_active, sort_order)
         VALUES
          (:title, :description, :icon, :ctaType, :ctaLabel, :ctaHref, :accordionItems, :isActive, :sortOrder)`,
        { ...row, sortOrder: nextSortOrder++ }
      );
    }
  }

  await conn.execute(`INSERT INTO service_content_syncs (version) VALUES (:version)`, {
    version: SERVICE_CONTENT_VERSION,
  });
}

const SERVICE_TRANSLATIONS_VERSION = "2026-09-24-rw-translations";

// Fills in the Kinyarwanda copy for the default services once. Only empty
// fields are set, so translations an admin already entered are kept.
async function seedServiceTranslations(conn) {
  const [[syncRow]] = await conn.execute(
    `SELECT COUNT(*) as count FROM service_content_syncs WHERE version = :version`,
    { version: SERVICE_TRANSLATIONS_VERSION }
  );
  if (syncRow.count > 0) return;

  for (const [title, rw] of Object.entries(SERVICE_TRANSLATIONS_RW)) {
    await conn.execute(
      `UPDATE services SET
        title_rw = COALESCE(title_rw, :titleRw),
        description_rw = COALESCE(description_rw, :descriptionRw),
        cta_label_rw = COALESCE(cta_label_rw, :ctaLabelRw),
        accordion_items_rw = COALESCE(accordion_items_rw, :accordionItemsRw)
       WHERE title = :title`,
      {
        title,
        titleRw: rw.title,
        descriptionRw: rw.description,
        ctaLabelRw: rw.ctaLabel,
        accordionItemsRw: rw.accordionItems.length ? JSON.stringify(rw.accordionItems) : null,
      }
    );
  }

  await conn.execute(`INSERT INTO service_content_syncs (version) VALUES (:version)`, {
    version: SERVICE_TRANSLATIONS_VERSION,
  });
}

let schemaReady = null;

// Runs migrations/seeding once per pool lifetime, lazily, the first time a
// caller actually needs the database — avoids top-level await and lets every
// read/write path degrade the same way (see isDbAvailable) if Hostinger's
// MySQL host isn't configured yet or is briefly unreachable.
export function ready() {
  if (!pool) return Promise.resolve(false);
  if (!schemaReady) {
    schemaReady = (async () => {
      const conn = await pool.getConnection();
      try {
        await runMigrations(conn);
        await seedServices(conn);
        await refreshServiceContent(conn);
        await seedServiceTranslations(conn);
        return true;
      } finally {
        conn.release();
      }
    })().catch((error) => {
      console.error("[db] schema setup failed:", error.message);
      schemaReady = null;
      return false;
    });
  }
  return schemaReady;
}

// Converts a MySQL "YYYY-MM-DD HH:MM:SS(.ffffff)?" string (returned because
// the pool is configured with dateStrings + timezone "Z") into an ISO 8601
// string, matching the format the previous SQLite-backed columns used.
export function toIso(value) {
  if (!value) return value;
  const [date, time = "00:00:00"] = value.split(" ");
  const [whole, fraction = ""] = time.split(".");
  const millis = (fraction + "000").slice(0, 3);
  return `${date}T${whole}.${millis}Z`;
}

export default pool;
