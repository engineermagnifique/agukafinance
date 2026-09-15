import { Search, Bell, LogOut } from "lucide-react";
import { logoutAction } from "@/app/dashboard/actions";

export default function DashboardHeader({ email }) {
  const initials = (email || "A").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white px-4 shadow-[0_1px_2px_rgba(15,28,46,0.04)] sm:px-8">
      <form action="/dashboard/clients" method="GET" className="hidden max-w-xs flex-1 sm:flex">
        <label className="relative w-full">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            name="q"
            placeholder="Search clients…"
            className="w-full rounded-full border border-gray-200 bg-cream py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
          />
        </label>
      </form>

      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-cream hover:text-navy"
        >
          <Bell size={17} />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-xs leading-tight sm:block">
            <span className="block font-semibold text-navy">Admin</span>
            <span className="block text-muted">{email}</span>
          </span>
        </div>
        <form action={logoutAction} className="sm:hidden">
          <button
            type="submit"
            aria-label="Log out"
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-cream hover:text-navy"
          >
            <LogOut size={17} />
          </button>
        </form>
      </div>
    </header>
  );
}
