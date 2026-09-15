"use client";

import Link from "next/link";
import Tilt from "react-parallax-tilt";
import StatusDonut from "@/components/dashboard/status-donut";

export default function LeadPipelineCard({ data }) {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={900}
      scale={1.02}
      transitionSpeed={1000}
      glareEnable
      glareMaxOpacity={0.25}
      glareColor="#ffffff"
      glarePosition="all"
      glareBorderRadius="16px"
      className="relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-[0_10px_24px_rgba(1,31,72,0.25)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border-[8px] border-white/20 bg-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full border-[20px] border-white/20 bg-transparent"
      />

      <div className="relative flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Lead pipeline</h2>
        <Link href="/dashboard/clients" className="text-xs font-semibold text-gold hover:text-white">
          View all →
        </Link>
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <StatusDonut data={data} dark />
      </div>
    </Tilt>
  );
}
