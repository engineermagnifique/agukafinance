import Link from "next/link";
import { Users, Eye, TrendingUp, BarChart3 } from "lucide-react";
import { getVisitorStats, percentChange, VISITOR_RANGES } from "@/lib/visitors";
import VisitsChart from "@/components/dashboard/visits-chart";
import StatCard from "@/components/dashboard/stat-card";
import ExpandableTable from "@/components/dashboard/expandable-table";
import Reveal from "@/components/ui/reveal";

export const dynamic = "force-dynamic";
export const metadata = { title: "Visitors" };

const RANGE_LABELS = { "7d": "7 days", "30d": "30 days", all: "All time" };
const RANGE_PHRASE = { "7d": "the last 7 days", "30d": "the last 30 days", all: "all time" };

function trendFrom(current, previous) {
  const change = percentChange(current, previous);
  if (change === null) return undefined;
  return {
    direction: change >= 0 ? "up" : "down",
    value: `${Math.abs(Math.round(change))}%`,
  };
}

export default async function VisitorsPage({ searchParams }) {
  const params = await searchParams;
  const range = VISITOR_RANGES.includes(params?.range) ? params.range : "7d";
  const stats = getVisitorStats({ range });
  const hasVisits = stats.totals.views > 0;
  const visitorSparkline = stats.daily.map((d) => ({ value: d.visitors }));
  const viewSparkline = stats.daily.map((d) => ({ value: d.views }));

  const recentRows = stats.recent.map((visit) => ({
    path: visit.path,
    referrer: visit.referrer || "Direct",
    device: visit.device,
    time: formatTime(visit.created_at),
  }));

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Website visitors</h1>
          <p className="mt-1 text-sm text-muted">
            Traffic to your public site over {RANGE_PHRASE[range]}.
          </p>
        </div>
        <div className="flex gap-2">
          {VISITOR_RANGES.map((r) => (
            <Link
              key={r}
              href={r === "7d" ? "/dashboard/visitors" : `/dashboard/visitors?range=${r}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                range === r
                  ? "bg-brand text-white"
                  : "border border-gray-200 bg-white text-ink hover:border-brand/40"
              }`}
            >
              {RANGE_LABELS[r]}
            </Link>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Visitors today"
          value={stats.today.visitors}
          icon={Users}
          highlighted
          caption={`${stats.totals.visitors} all-time`}
          sparkline={visitorSparkline}
          delay={0}
        />
        <StatCard
          label="Page views today"
          value={stats.today.views}
          icon={Eye}
          caption={`${stats.totals.views} all-time`}
          sparkline={viewSparkline}
          delay={0.05}
        />
        <StatCard
          label="Visitors"
          value={stats.currentPeriod.visitors}
          icon={TrendingUp}
          trend={trendFrom(stats.currentPeriod.visitors, stats.previousPeriod?.visitors)}
          caption={
            stats.previousPeriod
              ? `vs previous period: ${stats.previousPeriod.visitors}`
              : RANGE_LABELS[range]
          }
          delay={0.1}
        />
        <StatCard
          label="Page views"
          value={stats.currentPeriod.views}
          icon={BarChart3}
          trend={trendFrom(stats.currentPeriod.views, stats.previousPeriod?.views)}
          caption={
            stats.previousPeriod
              ? `vs previous period: ${stats.previousPeriod.views}`
              : RANGE_LABELS[range]
          }
          delay={0.15}
        />
      </div>

      <Reveal
        delay={0.15}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
      >
        <h2 className="text-base font-semibold text-navy">Daily page views ({RANGE_LABELS[range]})</h2>
        {hasVisits ? (
          <div className="mt-6">
            <VisitsChart data={stats.daily} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">No visits recorded yet.</p>
        )}
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal
          delay={0.2}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
        >
          <h2 className="text-base font-semibold text-navy">Top pages</h2>
          <p className="mt-0.5 text-xs text-muted">The most-visited pages on your site.</p>
          <div className="mt-4">
            <ExpandableTable
              rows={stats.topPages}
              columns={[
                { key: "path", label: "Page" },
                { key: "views", label: "Views" },
              ]}
              initialCount={5}
            />
          </div>
        </Reveal>

        <Reveal
          delay={0.25}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
        >
          <h2 className="text-base font-semibold text-navy">Top referrers</h2>
          <p className="mt-0.5 text-xs text-muted">Where your visitors are coming from.</p>
          <div className="mt-4">
            <ExpandableTable
              rows={stats.topReferrers}
              columns={[
                { key: "referrer", label: "Source" },
                { key: "views", label: "Views" },
              ]}
              initialCount={5}
            />
          </div>
        </Reveal>
      </div>

      <Reveal
        delay={0.3}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
      >
        <h2 className="text-base font-semibold text-navy">Recent visits</h2>
        <p className="mt-0.5 text-xs text-muted">
          A live log of the latest page views, with browser and device info.
        </p>
        <div className="mt-4">
          <ExpandableTable
            rows={recentRows}
            columns={[
              { key: "path", label: "Page" },
              { key: "referrer", label: "Referrer" },
              { key: "device", label: "Device" },
              { key: "time", label: "Time" },
            ]}
            initialCount={8}
          />
        </div>
      </Reveal>
    </div>
  );
}

function formatTime(value) {
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}
