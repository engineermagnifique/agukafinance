"use client";

import { useActionState, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginAction } from "./actions";

const initialState = { error: null };

const fieldClass =
  "w-full rounded-[3px] border border-gray-300 bg-cream py-3 pl-10 pr-10 text-[13px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

const fieldIconClass = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted";

export default function LoginForm({ next }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-7 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <div className="relative">
        <Mail size={16} className={fieldIconClass} />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          className={fieldClass}
        />
      </div>

      <div className="relative">
        <Lock size={16} className={fieldIconClass} />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          aria-label="Password"
          className={fieldClass}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-medium text-ink">
          <input type="checkbox" name="remember" className="h-3.5 w-3.5 accent-brand" />
          Remember me
        </label>
      </div>

      {state?.error && <p className="text-xs font-medium text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-[3px] bg-gradient-to-br from-brand to-brand-dark px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
