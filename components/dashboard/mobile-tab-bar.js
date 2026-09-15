"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "@/components/dashboard/sidebar-nav";

export default function MobileTabBar({ badges = {} }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-navy pt-1.5 sm:hidden"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        const badge = badges[href];

        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-1 flex-col items-center gap-1 px-1 py-1.5 text-center text-[10px] font-semibold leading-none"
          >
            {isActive && (
              <motion.span
                layoutId="dashboard-nav-active-mobile"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-brand"
              />
            )}
            <span className="relative">
              <Icon size={20} className={isActive ? "text-brand" : "text-white/60"} />
              {badge ? (
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-navy">
                  {badge}
                </span>
              ) : null}
            </span>
            <span className={isActive ? "text-white" : "text-white/50"}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
