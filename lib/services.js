import db from "@/lib/db";

const CTA_TYPES = ["info", "apply", "accordion", "none"];

export function listServices() {
  return db.prepare(`SELECT * FROM services ORDER BY sort_order ASC, id ASC`).all().map(parseRow);
}

export function listActiveServices() {
  return db
    .prepare(`SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`)
    .all()
    .map(parseRow);
}

export function getService(id) {
  const row = db.prepare(`SELECT * FROM services WHERE id = ?`).get(id);
  return row ? parseRow(row) : null;
}

export function createService(data) {
  const info = db
    .prepare(
      `INSERT INTO services
        (title, description, icon, cta_type, cta_label, cta_href, accordion_items, is_active, sort_order)
       VALUES
        (@title, @description, @icon, @ctaType, @ctaLabel, @ctaHref, @accordionItems, @isActive, @sortOrder)`
    )
    .run(toRow(data));
  return info.lastInsertRowid;
}

export function updateService(id, data) {
  db.prepare(
    `UPDATE services SET
      title = @title,
      description = @description,
      icon = @icon,
      cta_type = @ctaType,
      cta_label = @ctaLabel,
      cta_href = @ctaHref,
      accordion_items = @accordionItems,
      is_active = @isActive,
      sort_order = @sortOrder,
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
     WHERE id = @id`
  ).run({ ...toRow(data), id });
}

export function deleteService(id) {
  db.prepare(`DELETE FROM services WHERE id = ?`).run(id);
}

export function moveService(id, direction) {
  const services = listServices();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= services.length) return;

  const current = services[index];
  const swapWith = services[swapIndex];

  const update = db.prepare(`UPDATE services SET sort_order = ? WHERE id = ?`);
  const transaction = db.transaction(() => {
    update.run(swapWith.sortOrder, current.id);
    update.run(current.sortOrder, swapWith.id);
  });
  transaction();
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
