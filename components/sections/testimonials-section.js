import Reveal from "@/components/ui/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import TestimonialCarousel from "@/components/ui/testimonial-carousel";

export default function TestimonialsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow align="center">WHAT CLIENTS SAY</Eyebrow>
          <h2 className="mt-3 text-[clamp(28px,3.6vw,42px)] font-bold leading-[1.15] text-navy">
            Trusted by families and businesses across Texas
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <TestimonialCarousel />
        </Reveal>
      </div>
    </section>
  );
}
