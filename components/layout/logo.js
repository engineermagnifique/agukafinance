import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.png";
import { siteConfig } from "@/lib/site-config";

export default function Logo({ size = "header" }) {
  const dimensions =
    size === "footer"
      ? { width: 240, height: 92, className: "w-[200px] sm:w-[240px]" }
      : { width: 150, height: 58, className: "w-[110px] sm:w-[140px]" };

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
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
