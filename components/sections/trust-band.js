import Image from "next/image";
import dayImage from "@/public/images/hero-daylight.png";
import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";

const stats = [
  { value: "10+", label: "Years serving Texas families" },
  { value: "3", label: "Insurance, mortgage & tax lines" },
  { value: "100%", label: "Personal, honest guidance" },
];

export default function TrustBand() {
  return (
    <section className="relative isolate overflow-hidden bg-navy py-20 text-white sm:py-28">
      <Image
        src={dayImage}
        alt="A family smiling together in front of their home and cars in the driveway"
        fill
        sizes="100vw"
        className="object-cover object-[75%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40 sm:bg-[linear-gradient(90deg,#011f48f2_0%,#011f48d0_45%,#011f48a6_75%,#011f4873_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-md">
          <Eyebrow>WHY FAMILIES TRUST US</Eyebrow>
          <h2 className="mt-3 text-[clamp(28px,3.6vw,42px)] font-bold leading-[1.15]">
            A steady partner for the decisions that matter
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            From your first policy to your next big move, our team walks
            alongside you with clear guidance instead of sales pressure.
          </p>
        </Reveal>

        <div className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={0.1 + index * 0.1}
              className="border-l-2 border-brand/60 pl-4"
            >
              <p className="text-4xl font-extrabold text-gold">{stat.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/70 sm:whitespace-nowrap">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
