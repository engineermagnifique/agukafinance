export default function Eyebrow({ children, align = "left", tone = "brand" }) {
  const toneClass = tone === "gold" ? "text-gold" : "text-brand";

  return (
    <span
      className={`inline-flex items-center gap-3 text-[11px] font-bold tracking-[2.5px] ${toneClass} ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className="h-[2px] w-9 bg-current opacity-70"
      />
    </span>
  );
}
