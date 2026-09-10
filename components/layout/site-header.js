"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Layers, Mail, Menu, X } from "lucide-react";
import Logo from "@/components/layout/logo";
import { navLinks, siteConfig } from "@/lib/site-config";
import { scrollToContact } from "@/lib/scroll";

const SECTION_IDS = navLinks.map((link) => link.href.replace("#", ""));

const mobileIcons = { Home, Services: Layers, "Contact Us": Mail };

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTION_IDS[0]);
  const panelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    );
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveSection(mostVisible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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

  return (
    <header
      className={`sticky top-0 z-50 bg-navy transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_8px_24px_rgba(6,12,19,0.35)]"
          : "border-b border-white/10"
      }`}
    >
      <div className="relative z-50 mx-auto flex h-[76px] max-w-7xl items-center justify-between bg-navy px-6 sm:h-[88px] lg:px-10">
        <Logo size="header" />

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 text-[14px] font-semibold tracking-wide text-white/85 lg:flex"
        >
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = id === activeSection;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative py-2 transition-colors ${
                  isActive ? "text-white" : "hover:text-white"
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
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/?service=General%20Consultation#contact"
            onClick={scrollToContact}
            className="hidden rounded-[3px] bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark lg:inline-flex"
          >
            Schedule a Free Consultation
          </Link>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-controls="mobile-nav"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
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
              className="relative z-50 overflow-hidden border-t border-white/10 bg-navy lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-5 text-white">
                {navLinks.map((link) => {
                  const Icon = mobileIcons[link.label];
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2.5 py-3 text-sm font-semibold tracking-wide transition-colors hover:bg-white/5 hover:text-brand"
                    >
                      {Icon && <Icon size={17} className="text-brand" />}
                      {link.label}
                    </a>
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
                  className="mt-1 px-2.5 py-2 text-sm font-medium text-white/60"
                >
                  Call {siteConfig.phone}
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
