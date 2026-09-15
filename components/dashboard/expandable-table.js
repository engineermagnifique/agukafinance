"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ExpandableTable({ rows, columns, initialCount = 5 }) {
  const [expanded, setExpanded] = useState(false);
  const visibleRows = expanded ? rows : rows.slice(0, initialCount);
  const hasMore = rows.length > initialCount;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead className="bg-cream text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-2.5">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleRows.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-2.5 text-ink">
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-muted">
                  No data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-brand transition-colors hover:bg-cream"
        >
          {expanded ? (
            <>
              See less <ChevronUp size={14} />
            </>
          ) : (
            <>
              See more <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
