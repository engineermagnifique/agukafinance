"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, ListChecks, Users, LineChart, Mail } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: ListChecks },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/newsletter", label: "Newsletter", icon: Mail },
  { href: "/dashboard/visitors", label: "Visitors", icon: LineChart },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function SidebarNav({ badges = {} }) {
  const pathname = usePathname();

  return (
    <nav className="relative flex flex-col gap-1 overflow-x-auto px-3 pb-3 sm:flex-1 sm:overflow-visible sm:pb-0">
      <span className="hidden px-3 pb-2 text-[11px] font-bold uppercase tracking-[1.5px] text-white/50 sm:block">
        Main menu
      </span>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="flex gap-1 sm:flex-col"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          const badge = badges[href];

          return (
            <motion.div key={href} variants={item}>
              <Link
                href={href}
                className="group relative flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-3 text-[15px] font-medium transition-colors hover:bg-white/10"
              >
                {isActive && (
                  <>
                    <motion.span
                      layoutId="dashboard-nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-brand shadow-[0_8px_16px_rgba(240,125,26,0.35)] sm:-right-3 sm:rounded-l-xl sm:rounded-r-none sm:bg-white sm:shadow-[0_8px_16px_rgba(15,28,46,0.15)]"
                    />
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                      className="absolute inset-x-0 top-0 hidden h-2.5 w-full sm:block"
                    >
                      <path
                        d="M0,0 L100,0 C75,0 75,10 50,10 C25,10 25,0 0,0 Z"
                        fill="#011f48"
                      />
                    </svg>
                  </>
                )}
                <span
                  className={`relative flex flex-1 items-center gap-3 ${
                    isActive
                      ? "text-white sm:text-navy"
                      : "text-white/75 group-hover:text-white"
                  }`}
                >
                  <Icon
                    size={19}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                  />
                  {label}
                </span>
                {badge ? (
                  <span
                    className={`relative grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[11px] font-bold ${
                      isActive
                        ? "bg-white/25 text-white sm:bg-brand/15 sm:text-brand-dark"
                        : "bg-gold/20 text-gold"
                    }`}
                  >
                    {badge}
                  </span>
                ) : null}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </nav>
  );
}
