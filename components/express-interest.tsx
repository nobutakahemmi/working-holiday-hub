"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PROFILE_KEY, SESSION_KEY, type Session } from "@/lib/storage";
import { useLocalJson } from "@/lib/use-local-json";
import type { Profile } from "@/lib/types";

export function ExpressInterest({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [session] = useLocalJson<Session | null>(SESSION_KEY, null);
  const [profile] = useLocalJson<Profile | null>(PROFILE_KEY, null);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function send() {
    const response = await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, profile }),
    });
    setStatus(response.ok ? "sent" : "error");
  }

  if (!session) {
    return (
      <p className="text-sm">
        <Link href="/account" className="underline underline-offset-4">
          Sign in with the mock magic link
        </Link>{" "}
        and save a profile before you express interest.
      </p>
    );
  }

  if (!profile?.passport) {
    return (
      <p className="text-sm">
        Save your{" "}
        <Link href="/account" className="underline underline-offset-4">
          profile
        </Link>{" "}
        so we can attach it to the introduction email.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      <Button type="button" onClick={send}>
        Express interest
      </Button>
      {status === "sent" ? (
        <p className="text-sm" role="status">
          Mock email queued to the host inbox (Resend is not connected). Your
          profile was included.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          Could not queue interest. Try again.
        </p>
      ) : null}
    </div>
  );
}
