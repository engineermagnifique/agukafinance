import Image from "next/image";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getAdminSession } from "@/lib/session";
import { logoutAction } from "@/app/dashboard/actions";
import { siteConfig } from "@/lib/site-config";
import logo from "@/public/images/logo.png";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import MobileTabBar from "@/components/dashboard/mobile-tab-bar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PageTransition from "@/components/dashboard/page-transition";
import Reveal from "@/components/ui/reveal";
import { countLeadsByStatus } from "@/lib/leads";
import { getVisitorStats } from "@/lib/visitors";

export default async function DashboardLayout({ children }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/dashboard/login");
  }

  const leadCounts = countLeadsByStatus();
  const openLeads = leadCounts.new + leadCounts.contacted + leadCounts.in_progress;
  const visitorsToday = getVisitorStats().today.visitors;

  const badges = {
    "/dashboard/clients": openLeads || null,
    "/dashboard/visitors": visitorsToday || null,
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink sm:flex-row">
      <aside className="relative hidden shrink-0 flex-col overflow-hidden bg-navy sm:sticky sm:top-0 sm:flex sm:h-screen sm:w-64">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 bottom-24 h-48 w-48 rounded-full bg-gold/10 blur-3xl"
        />

        <div className="relative px-3 pt-6">
          <p className="px-3 pb-4 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/50">
            Admin dashboard
          </p>
        </div>

        <SidebarNav badges={badges} />

        <div className="relative p-3 sm:pb-6">
          <Reveal
            delay={0.3}
            whileHover={{ y: -2 }}
            className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
          >
            <Image
              src={logo}
              alt={siteConfig.name}
              width={150}
              height={58}
              className="h-auto w-[100px] rounded-lg"
            />
            <form action={logoutAction} className="w-full">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cream px-3 py-2.5 text-sm font-semibold text-navy transition-all duration-300 hover:scale-[1.02] hover:bg-brand hover:text-white active:scale-[0.98]"
              >
                <LogOut size={16} /> Log out
              </button>
            </form>
          </Reveal>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader email={session.email} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-8 sm:px-8 sm:pb-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <MobileTabBar badges={badges} />
    </div>
  );
}
