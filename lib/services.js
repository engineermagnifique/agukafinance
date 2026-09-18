import pool, { ready, toIso } from "@/lib/db";
import {
  lifeInsuranceApplyUrl,
  autoHomeCoverage,
  commercialLinesCoverage,
  commercialLinesQuoteUrl,
  mortgagePortalUrl,
} from "@/lib/site-config";

const CTA_TYPES = ["info", "apply", "accordion", "none"];

const commercialLinesDescription = `Fill out a quick form and submit it to our team. We'll compare coverage and rates from leading commercial insurance carriers to find the right protection for your business. No obligation, no pressure, and no hidden fees. We never sell your information, and you'll never receive cold calls or spam from us, guaranteed. Coverage includes ${commercialLinesCoverage.join(", ")}.`;

// Mirrors lib/db.js's seed data. Used when the database is unavailable (e.g.
// no hosted database configured yet) so the public site still renders.
const FALLBACK_SERVICES = [
  {
    id: "fallback-life",
    title: "Life",
    description:
      "Compare real life insurance quotes instantly from top-rated carriers in minutes. No phone number or email required, guaranteed. No spam emails, no telemarketing calls, and no obligation. When you're ready, apply online and receive approval in minutes on select policies.",
    icon: "Heart",
    ctaType: "apply",
    ctaLabel: "Apply for life insurance",
    ctaHref: lifeInsuranceApplyUrl,
    accordionItems: [],
    isActive: true,
    sortOrder: 0,
  },
  {
    id: "fallback-auto-home",
    title: "Auto & Home",
    description:
      "Complete a quick form and let our licensed agents do the work. We'll compare rates from leading insurance carriers and provide personalized Auto & Home Insurance quotes tailored to your needs and budget. No obligation, no pressure, and no hidden fees. We never sell your information, and you'll never receive cold calls or spam from us, guaranteed.",
    icon: "Home",
    ctaType: "accordion",
    ctaLabel: "View coverage options",
    ctaHref: null,
    accordionItems: autoHomeCoverage,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "fallback-commercial-lines",
    title: "Commercial Lines",
    description: commercialLinesDescription,
    icon: "Building2",
    ctaType: "apply",
    ctaLabel: "Get a Business Quote",
    ctaHref: commercialLinesQuoteUrl,
    accordionItems: [],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "fallback-tax-financial",
    title: "Tax & Financial Services",
    description:
      "Enjoy our year-round income tax preparation and support services. Our fixed fees mean no surprises. We stand behind our work with an IRS compliance and accuracy guarantee letter for your peace of mind, at no additional charge.",
    icon: "Landmark",
    ctaType: "info",
    ctaLabel: "Compare Income Tax Prep Fee",
    ctaHref: null,
    accordionItems: [],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "fallback-mortgage-support",
    title: "Mortgage Support",
    description:
      "Explore mortgage support services provided by a licensed mortgage loan originator acting through an approved mortgage broker company (NMLS #320841). Clicking the link below will redirect you to a third-party portal and you're subject to their privacy terms and conditions.",
    icon: "HandCoins",
    ctaType: "apply",
    ctaLabel: "Get a Free Quote",
    ctaHref: mortgagePortalUrl,
    accordionItems: [],
    isActive: true,
    sortOrder: 4,
  },
];

export async function listServices() {
  if (!(await ready())) return FALLBACK_SERVICES;
  try {
    const [rows] = await pool.query(`SELECT * FROM services ORDER BY sort_order ASC, id ASC`);
    return rows.map(parseRow);
  } catch (error) {
    console.error("[services] listServices failed, using fallback:", error.message);
    return FALLBACK_SERVICES;
  }
}

export async function listActiveServices() {
  if (!(await ready())) return FALLBACK_SERVICES;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`
    );
    return rows.map(parseRow);
  } catch (error) {
    console.error("[services] listActiveServices failed, using fallback:", error.message);
    return FALLBACK_SERVICES;
  }
}

export async function getService(id) {
  await ready();
  const [rows] = await pool.execute(`SELECT * FROM services WHERE id = :id`, { id });
  return rows[0] ? parseRow(rows[0]) : null;
}

export async function createService(data) {
  await ready();
  const [result] = await pool.execute(
    `INSERT INTO services
      (title, description, icon, cta_type, cta_label, cta_href, accordion_items, is_active, sort_order)
     VALUES
      (:title, :description, :icon, :ctaType, :ctaLabel, :ctaHref, :accordionItems, :isActive, :sortOrder)`,
    toRow(data)
  );
  return result.insertId;
}

export async function updateService(id, data) {
  await ready();
  await pool.execute(
    `UPDATE services SET
      title = :title,
      description = :description,
      icon = :icon,
      cta_type = :ctaType,
      cta_label = :ctaLabel,
      cta_href = :ctaHref,
      accordion_items = :accordionItems,
      is_active = :isActive,
      sort_order = :sortOrder
     WHERE id = :id`,
    { ...toRow(data), id }
  );
}

export async function deleteService(id) {
  await ready();
  await pool.execute(`DELETE FROM services WHERE id = :id`, { id });
}

export async function moveService(id, direction) {
  const services = await listServices();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= services.length) return;

  const current = services[index];
  const swapWith = services[swapIndex];

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(`UPDATE services SET sort_order = :sortOrder WHERE id = :id`, {
      sortOrder: swapWith.sortOrder,
      id: current.id,
    });
    await conn.execute(`UPDATE services SET sort_order = :sortOrder WHERE id = :id`, {
      sortOrder: current.sortOrder,
      id: swapWith.id,
    });
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

function toRow(data) {
  return {
    title: data.title,
    description: data.description,
    icon: data.icon || "Shield",
    ctaType: CTA_TYPES.includes(data.ctaType) ? data.ctaType : "info",
    ctaLabel: data.ctaLabel || null,
    ctaHref: data.ctaHref || null,
    accordionItems:
      Array.isArray(data.accordionItems) && data.accordionItems.length > 0
        ? JSON.stringify(data.accordionItems)
        : null,
    isActive: data.isActive ? 1 : 0,
    sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 0,
  };
}

function parseRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    ctaType: row.cta_type,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    accordionItems: row.accordion_items ? JSON.parse(row.accordion_items) : [],
    isActive: !!row.is_active,
    sortOrder: row.sort_order,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}
