import Image from "next/image";
import { ShieldCheck, LineChart, Users, ListChecks } from "lucide-react";
import logo from "@/public/images/logo.png";
import { siteConfig } from "@/lib/site-config";
import Reveal from "@/components/ui/reveal";
import LoginForm from "./login-form";

export const metadata = { title: "Dashboard sign in" };

const highlights = [
  { icon: ListChecks, label: "Manage the services shown on your site" },
  { icon: LineChart, label: "See who's visiting, and from where" },
  { icon: Users, label: "Follow every client from first contact to done" },
];

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "/dashboard";

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 flex-col overflow-hidden bg-navy px-12 py-10 text-white lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/5" />
          <div className="absolute -right-14 top-1/3 h-56 w-56 rounded-full bg-brand/10" />
          <div className="absolute bottom-[-90px] left-1/4 h-64 w-64 rounded-full bg-white/5" />
        </div>

        <Image src={logo} alt={siteConfig.name} width={150} height={58} className="relative w-[130px] h-auto" priority />

        <div className="relative flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <Reveal>
            <ShieldIllustration />
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/70">
              Sign in to manage {siteConfig.name}&apos;s services, visitors, and client
              follow-ups in one place.
            </p>
          </Reveal>

          <ul className="flex flex-col gap-3">
            {highlights.map(({ icon: Icon, label }, index) => (
              <Reveal key={label} delay={0.2 + index * 0.08} as="li">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
                    <Icon size={16} />
                  </span>
                  {label}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-16 lg:w-1/2">
        <Reveal className="w-full max-w-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-brand lg:hidden">
            {siteConfig.shortName}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-navy lg:mt-0">Log in</h2>
          <p className="mt-1.5 text-sm text-muted">Sign in to the admin dashboard.</p>
          <LoginForm next={next} />
        </Reveal>
      </div>
    </div>
  );
}

function ShieldIllustration() {
  return (
    <div className="relative mx-auto grid h-40 w-40 place-items-center">
      <div className="absolute inset-0 rounded-full bg-white/10" />
      <div className="absolute inset-4 rounded-full bg-white/10" />
      <div className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark shadow-lg">
        <ShieldCheck size={44} className="text-white" />
      </div>
      <span aria-hidden="true" className="absolute right-4 top-2 h-3 w-3 rounded-full bg-gold" />
      <span aria-hidden="true" className="absolute bottom-3 left-5 h-2.5 w-2.5 rounded-full bg-white/40" />
    </div>
  );
}
