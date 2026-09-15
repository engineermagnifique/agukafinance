import { Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function TopBar() {
  return (
    <div className="hidden bg-deep text-[11px] text-white/60 sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 lg:px-10">
        <div className="flex items-center gap-6">
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
          >
            <Phone size={12} className="text-brand" />
            {siteConfig.phone}
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
          >
            <Mail size={12} className="text-brand" />
            {siteConfig.email}
          </a>
        </div>
        <div className="hidden items-center gap-1.5 lg:flex">
          <MapPin size={12} className="text-brand" />
          {siteConfig.address.line1}, {siteConfig.address.line2}
        </div>
      </div>
    </div>
  );
}
