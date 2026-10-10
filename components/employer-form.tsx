"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const empty = {
  businessName: "",
  location: "",
  website: "",
  roleTypes: "",
  headcount: "",
  season: "",
};

export function EmployerForm() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  function update(key: keyof typeof empty, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/employer-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setForm(empty);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="biz">Business name</Label>
            <Input
              id="biz"
              value={form.businessName}
              onChange={(event) => update("businessName", event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={form.website}
              onChange={(event) => update("website", event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="roles">Role types</Label>
            <Textarea
              id="roles"
              value={form.roleTypes}
              onChange={(event) => update("roleTypes", event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="headcount">Headcount</Label>
            <Input
              id="headcount"
              type="number"
              min={1}
              value={form.headcount}
              onChange={(event) => update("headcount", event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="season">Season</Label>
            <Input
              id="season"
              placeholder="Nov 2026 – Mar 2027"
              value={form.season}
              onChange={(event) => update("season", event.target.value)}
              required
            />
          </div>
          <Button type="submit">Send interest</Button>
          {status === "sent" ? (
            <p className="text-sm" role="status">
              Saved locally. We will review the business before any job goes
              live. No commission-only roles.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="text-sm text-destructive" role="alert">
              Could not save that form. Check the website URL and try again.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
