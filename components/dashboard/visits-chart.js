"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function VisitsChart({ data }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f07d1a" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f07d1a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="4 4" />
          <XAxis
            dataKey="day"
            tickFormatter={formatShortDay}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            formatter={(value) => [`${value} views`, ""]}
            labelFormatter={(label) => formatFullDay(label)}
            contentStyle={{
              borderRadius: 4,
              border: "1px solid #e5e7eb",
              fontSize: 12,
              boxShadow: "0 8px 24px rgba(15,28,46,0.12)",
            }}
            labelStyle={{ color: "#011f48", fontWeight: 600, marginBottom: 4 }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#f07d1a"
            strokeWidth={2}
            fill="url(#visitsFill)"
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatShortDay(day) {
  try {
    return new Date(`${day}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return day;
  }
}

function formatFullDay(day) {
  try {
    return new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return day;
  }
}
