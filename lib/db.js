import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { lifeInsuranceApplyUrl, personalLinesCoverage } from "@/lib/site-config";

const dataDir = path.join(process.cwd(), "data");

const globalForDb = globalThis;

function openDatabase() {
  // Creating the data dir and opening the file both belong inside the try
  // block below — on a read-only filesystem (e.g. Vercel) either can throw.
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const instance = new Database(path.join(dataDir, "aguka.db"));
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  runMigrations(instance);
  seedServices(instance);
  return instance;
}

function runMigrations(instance) {
  instance.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'Shield',
      cta_type TEXT NOT NULL DEFAULT 'info',
      cta_label TEXT,
      cta_href TEXT,
      accordion_items TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      preferred_contact TEXT,
      coverage_needs TEXT,
      tax_support TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      next_follow_up_at TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS lead_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      body TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      referrer TEXT,
      visitor_id TEXT NOT NULL,
      user_agent TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);
    CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
    CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
  `);
}

function seedServices(instance) {
  const { count } = instance.prepare("SELECT COUNT(*) as count FROM services").get();
  if (count > 0) return;

  const insert = instance.prepare(`
    INSERT INTO services
      (title, description, icon, cta_type, cta_label, cta_href, accordion_items, is_active, sort_order)
    VALUES
      (@title, @description, @icon, @ctaType, @ctaLabel, @ctaHref, @accordionItems, @isActive, @sortOrder)
  `);

  const defaults = [
    {
      title: "Life",
      description:
        "Life coverage and fixed annuity options to help protect loved ones and support long-term financial goals.",
      icon: "Heart",
      ctaType: "apply",
      ctaLabel: "Apply for life insurance",
      ctaHref: lifeInsuranceApplyUrl,
      accordionItems: null,
      isActive: 1,
      sortOrder: 0,
    },
    {
      title: "Personal Lines",
      description:
        "Coverage options designed to help protect you, your family and the personal property you value.",
      icon: "Home",
      ctaType: "accordion",
      ctaLabel: "View coverage options",
      ctaHref: null,
      accordionItems: JSON.stringify(personalLinesCoverage),
      isActive: 1,
      sortOrder: 1,
    },
    {
      title: "Commercial Lines",
      description:
        "Comprehensive commercial insurance solutions designed to protect your business, assets, employees, and operations.",
      icon: "Building2",
      ctaType: "info",
      ctaLabel: "Request information",
      ctaHref: null,
      accordionItems: null,
      isActive: 1,
      sortOrder: 2,
    },
  ];

  const insertMany = instance.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  insertMany(defaults);
}

function safeOpenDatabase() {
  try {
    return openDatabase();
  } catch (error) {
    // On platforms with a read-only filesystem (e.g. Vercel serverless
    // functions), local SQLite can't be opened/created. Degrade instead of
    // crashing every route that imports this module — callers fall back to
    // static/default data until a hosted database is wired up.
    console.error(
      "[db] could not open local SQLite database, falling back to unavailable mode:",
      error.message
    );
    return null;
  }
}

const db = globalForDb.__agukaDb ?? safeOpenDatabase();
if (process.env.NODE_ENV !== "production") {
  globalForDb.__agukaDb = db;
}

export const isDbAvailable = db !== null;

export default db;
