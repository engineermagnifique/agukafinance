"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  in_progress: "#f07d1a",
  done: "#22c55e",
  empty: "#e5e7eb",
};

export default function StatusDonut({ data, dark = false }) {
  const total = data.reduce((sum, entry) => sum + entry.count, 0);
  const chartData = total > 0 ? data : [{ status: "empty", label: "No leads yet", count: 1 }];

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative h-[110px] w-[110px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              innerRadius={34}
              outerRadius={50}
              paddingAngle={total > 0 ? 3 : 0}
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={dark && entry.status === "empty" ? "rgba(255,255,255,0.15)" : COLORS[entry.status] || "#94a3b8"}
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${dark ? "text-white" : "text-navy"}`}>{total}</span>
          <span className={`text-[10px] font-semibold uppercase ${dark ? "text-white/50" : "text-muted"}`}>
            Total
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {data.map((entry) => (
          <li key={entry.status} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[entry.status] || "#94a3b8" }}
            />
            <span className={dark ? "text-white/80" : "text-ink"}>{entry.label}</span>
            <span className={`ml-auto font-semibold ${dark ? "text-white" : "text-navy"}`}>{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
