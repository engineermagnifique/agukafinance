"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.png";
import { siteConfig } from "@/lib/site-config";
import { useI18n } from "@/components/i18n/language-provider";
import { format } from "@/lib/i18n/config";

export default function Logo({ size = "header" }) {
  const { t } = useI18n();
  const dimensions =
    size === "footer"
      ? { width: 240, height: 94, className: "w-[200px] sm:w-[240px]" }
      : { width: 150, height: 59, className: "w-[110px] sm:w-[140px]" };

  return (
    <Link
      href="/"
      aria-label={format(t.common.logoHome, { name: siteConfig.name })}
      className="inline-flex shrink-0 items-center"
    >
      <Image
        src={logo}
        alt={siteConfig.name}
        width={dimensions.width}
        height={dimensions.height}
        className={`${dimensions.className} h-auto rounded-xl`}
        priority={size === "header"}
      />
    </Link>
  );
}
