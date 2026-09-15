import Link from "next/link";
import { ArrowUp, ArrowDown, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import MiniSparkline from "@/components/dashboard/mini-sparkline";
import FloatingDots from "@/components/dashboard/floating-dots";

export default function StatCard({
  label,
  value,
  icon: Icon,
  delay = 0,
  highlighted = false,
  trend,
  caption,
  sparkline,
  href,
}) {
  const positive = trend && trend.direction === "up";

  return (
    <Reveal
      delay={delay}
      whileHover={{ y: -3 }}
      className={`group relative overflow-hidden rounded-2xl p-3.5 transition-shadow duration-300 ${
        highlighted
          ? "bg-gradient-to-br from-navy to-[#0a2f63] text-white shadow-[0_10px_24px_rgba(1,31,72,0.25)] hover:shadow-[0_16px_32px_rgba(1,31,72,0.32)]"
          : "border border-gray-100 bg-white shadow-[0_1px_2px_rgba(15,28,46,0.04)] hover:shadow-[0_12px_24px_rgba(15,28,46,0.1)]"
      }`}
    >
      {!highlighted && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-dark transition-transform duration-300 group-hover:scale-x-100"
        />
      )}
      {highlighted && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full bg-white/[0.06]"
          />
          <FloatingDots />
        </>
      )}

      <div className="relative flex items-center justify-between">
        <span
          className={`text-[13px] font-bold tracking-tight ${highlighted ? "text-white/90" : "text-muted"}`}
        >
          {label}
        </span>
        {href ? (
          <Link
            href={href}
            aria-label={`View ${label.toLowerCase()}`}
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all duration-300 hover:scale-110 ${
              highlighted
                ? "bg-white/15 text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-white/25"
                : "bg-cream text-navy hover:bg-brand hover:text-white"
            }`}
          >
            <ArrowUpRight size={13} />
          </Link>
        ) : Icon ? (
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
              highlighted ? "bg-white/15 text-gold" : "bg-[#fff3e8] text-brand"
            }`}
          >
            <Icon size={14} />
          </span>
        ) : null}
      </div>

      <div className="relative mt-2 flex flex-wrap items-center gap-2">
        <p
          className={`text-[22px] font-extrabold leading-none tracking-tight ${
            highlighted ? "text-white" : "text-navy"
          }`}
        >
          {value}
        </p>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
              highlighted
                ? "bg-white/15 text-white"
                : positive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
            }`}
          >
            {positive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {trend.value}
          </span>
        )}
      </div>

      {caption && (
        <p className={`relative mt-1.5 text-xs ${highlighted ? "text-white/60" : "text-muted"}`}>
          {caption}
        </p>
      )}

      {sparkline && (
        <div className="relative">
          <MiniSparkline data={sparkline} color={highlighted ? "#ffb347" : "#f07d1a"} />
        </div>
      )}
    </Reveal>
  );
}
