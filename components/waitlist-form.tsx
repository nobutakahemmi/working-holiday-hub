"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WAITLIST_KEY, readJson, writeJson } from "@/lib/storage";

const emptyWaitlist: string[] = [];

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    const current = readJson<string[]>(WAITLIST_KEY, emptyWaitlist);
    writeJson(WAITLIST_KEY, [...new Set([...current, email])]);
    setStatus("saved");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get job alerts when winter listings open</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="waitlist-email">Email</Label>
            <Input
              id="waitlist-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <Button type="submit">Join waitlist</Button>
        </form>
        {status === "saved" ? (
          <p className="mt-3 text-sm" role="status">
            You are on the local waitlist. No email was sent — this build uses a
            mock inbox until Supabase is connected.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            Enter a valid email address.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
