"use client";

import { useState } from "react";
import { Heart, HandCoins, Landmark, ShieldCheck, Users } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import HighlightCard from "@/components/ui/highlight-card";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Insurance",
    description: "Life, home, auto and commercial coverage built around your family or business.",
  },
  {
    icon: Heart,
    title: "Mortgage",
    description: "Guidance from pre-approval to closing through a licensed mortgage broker.",
  },
  {
    icon: Landmark,
    title: "Tax Services",
    description: "Individual and small-business tax preparation with year-round support.",
  },
  {
    icon: HandCoins,
    title: "Financial Planning",
    description: "Annuities and long-term strategies to keep your money working for you.",
  },
  {
    icon: Users,
    title: "Client Support",
    description: "Honest, personal guidance from your first call through every step after.",
  },
];

export default function HighlightsStrip() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative z-20 -mt-14 px-6 pb-4 sm:-mt-16 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4">
        {highlights.map((item, index) => (
          <Reveal
            key={item.title}
            delay={0.05 + index * 0.08}
            as="div"
            className="grow shrink basis-[calc(50%-0.5rem)] sm:basis-[calc(33.333%-0.667rem)] lg:basis-[calc(20%-0.8rem)]"
          >
            <HighlightCard
              item={item}
              isFocused={hoveredIndex === index}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
