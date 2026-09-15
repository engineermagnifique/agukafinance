import Link from "next/link";
import { Users, Eye, Layers, Clock, Mail, ArrowUpRight } from "lucide-react";
import { countLeadsByStatus, listLeads, formatStatus } from "@/lib/leads";
import { getVisitorStats, percentChange } from "@/lib/visitors";
import { listServices } from "@/lib/services";
import { listSubscribers } from "@/lib/newsletter";
import Reveal from "@/components/ui/reveal";
import StatCard from "@/components/dashboard/stat-card";
import LeadPipelineCard from "@/components/dashboard/lead-pipeline-card";
import VisitsChart from "@/components/dashboard/visits-chart";
import ExpandableTable from "@/components/dashboard/expandable-table";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard overview" };

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  in_progress: "bg-brand/15 text-brand-dark",
  done: "bg-green-100 text-green-700",
};

function initialsFor(first, last) {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
}

function trendFrom(current, previous) {
  const change = percentChange(current, previous);
  if (change === null) return undefined;
  return {
    direction: change >= 0 ? "up" : "down",
    value: `${Math.abs(Math.round(change))}%`,
  };
}

export default async function DashboardOverviewPage() {
  const leadCounts = countLeadsByStatus();
  const totalLeads = Object.values(leadCounts).reduce((a, b) => a + b, 0);
  const recentLeads = listLeads().slice(0, 5);
  const stats = getVisitorStats({ range: "7d" });
  const services = listServices();
  const activeServices = services.filter((s) => s.isActive).length;
  const hiddenServices = services.length - activeServices;
  const subscriberCount = listSubscribers().length;

  const visitorSparkline = stats.daily.map((d) => ({ value: d.visitors }));
  const viewSparkline = stats.daily.map((d) => ({ value: d.views }));

  const tiles = [
    {
      label: "Website visitors",
      value: stats.totals.visitors,
      icon: Users,
      highlighted: true,
      trend: trendFrom(stats.currentPeriod.visitors, stats.previousPeriod?.visitors),
      caption: `${stats.currentPeriod.visitors} in the last 7 days`,
      sparkline: visitorSparkline,
    },
    {
      label: "Page views",
      value: stats.totals.views,
      icon: Eye,
      trend: trendFrom(stats.currentPeriod.views, stats.previousPeriod?.views),
      caption: `${stats.currentPeriod.views} in the last 7 days`,
      sparkline: viewSparkline,
    },
    {
      label: "Active services",
      value: activeServices,
      icon: Layers,
      href: "/dashboard/services",
      caption: hiddenServices > 0 ? `${hiddenServices} hidden` : "All services live",
    },
    {
      label: "Open leads",
      value: totalLeads - leadCounts.done,
      icon: Clock,
      href: "/dashboard/clients",
      caption: `${leadCounts.new} new · ${leadCounts.contacted} contacted`,
    },
    {
      label: "Newsletter subscribers",
      value: subscriberCount,
      icon: Mail,
      href: "/dashboard/newsletter",
      caption: subscriberCount > 0 ? "From your homepage signup" : "No subscribers yet",
    },
  ];

  const statusData = Object.entries(leadCounts).map(([status, count]) => ({
    status,
    label: formatStatus(status),
    count,
  }));

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Here&rsquo;s an overview of your site&rsquo;s traffic and client pipeline.</p>
        </div>
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-navy transition-colors hover:border-brand/40"
        >
          View all clients <ArrowUpRight size={13} />
        </Link>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((tile, index) => (
          <StatCard key={tile.label} {...tile} delay={index * 0.05} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal
          delay={0.15}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy">Traffic (last 7 days)</h2>
            <span className="rounded-full bg-cream px-3 py-1 text-[11px] font-semibold text-muted">Daily</span>
          </div>
          {stats.totals.views > 0 ? (
            <div className="mt-4">
              <VisitsChart data={stats.daily} />
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">No visits recorded yet.</p>
          )}
        </Reveal>

        <Reveal delay={0.2}>
          <LeadPipelineCard data={statusData} />
        </Reveal>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal
          delay={0.25}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy">Recent requests</h2>
            <Link href="/dashboard/clients" className="text-xs font-semibold text-brand hover:text-brand-dark">
              View all →
            </Link>
          </div>
          <ul className="mt-4 flex flex-col gap-1">
            {recentLeads.length === 0 && <li className="text-sm text-muted">No requests yet.</li>}
            {recentLeads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/dashboard/clients/${lead.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-colors hover:bg-cream"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff3e8] text-xs font-bold text-brand">
                    {initialsFor(lead.first_name, lead.last_name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-navy">
                      {lead.first_name} {lead.last_name}
                    </span>
                    <span className="block truncate text-xs text-muted">{lead.service}</span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[lead.status]}`}
                  >
                    {formatStatus(lead.status)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          delay={0.3}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy">Top pages</h2>
            <Link href="/dashboard/visitors" className="text-xs font-semibold text-brand hover:text-brand-dark">
              View all →
            </Link>
          </div>
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
      </div>
    </div>
  );
}
