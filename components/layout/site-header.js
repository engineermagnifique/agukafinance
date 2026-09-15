"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Home, Info, Layers, Mail, Menu, X } from "lucide-react";
import Logo from "@/components/layout/logo";
import TopBar from "@/components/layout/top-bar";
import { navLinks, siteConfig } from "@/lib/site-config";
import { scrollToContact } from "@/lib/scroll";

const mobileIcons = { Home, About: Info, Services: Layers, "Contact Us": Mail };

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef(null);
  const pathname = usePathname();

  function isActiveLink(href) {
    return href === "/" ? pathname === "/" : pathname?.startsWith(href);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <>
      <TopBar />
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_8px_24px_rgba(15,28,46,0.1)]"
            : "border-b border-gray-100"
        }`}
      >
      <div className="relative z-50 mx-auto flex h-[76px] max-w-7xl items-center justify-between bg-white px-6 sm:h-[88px] lg:px-10">
        <Logo size="header" />

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 text-[14px] font-semibold tracking-wide text-navy/60 lg:flex"
        >
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 transition-colors ${
                  isActive ? "text-navy" : "hover:text-navy"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-brand"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/?service=General%20Consultation#contact"
            onClick={scrollToContact}
            className="group hidden items-center gap-3 rounded-full bg-brand py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark lg:inline-flex"
          >
            Get a Free Quote
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={15} />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-controls="mobile-nav"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-md text-navy transition-colors hover:bg-navy/5 lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-deep/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.nav
              ref={panelRef}
              id="mobile-nav"
              aria-label="Mobile primary"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative z-50 overflow-hidden border-t border-gray-100 bg-white lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-5 text-navy">
                {navLinks.map((link) => {
                  const Icon = mobileIcons[link.label];
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-2.5 py-3 text-sm font-semibold tracking-wide transition-colors hover:bg-gray-50 hover:text-brand ${
                        isActiveLink(link.href) ? "text-brand" : ""
                      }`}
                    >
                      {Icon && <Icon size={17} className="text-brand" />}
                      {link.label}
                    </Link>
                  );
                })}

                <Link
                  href="/?service=General%20Consultation#contact"
                  onClick={() => {
                    setOpen(false);
                    scrollToContact();
                  }}
                  className="mt-3 rounded-[3px] bg-brand px-5 py-3.5 text-center text-sm font-semibold text-white"
                >
                  Schedule a Free Consultation
                </Link>
                <a
                  href={siteConfig.phoneHref}
                  className="mt-1 px-2.5 py-2 text-sm font-medium text-muted"
                >
                  Call {siteConfig.phone}
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
      </header>
    </>
  );
}
