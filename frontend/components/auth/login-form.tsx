"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getLoginErrorMessage, login } from "@/lib/auth-api";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      router.replace(nextPath);
      router.refresh();
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
      setIsSubmitting(false);
    }
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-ring"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-ring"
          />
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </Card>
  );
}
