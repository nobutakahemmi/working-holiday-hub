"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/data";
import { ADMIN_KEY, EXTRA_JOBS_KEY, MOCK_ADMIN_SECRET } from "@/lib/storage";
import { useLocalJson } from "@/lib/use-local-json";
import type { Job } from "@/lib/types";

const noJobs: Job[] = [];

export function AdminJobs() {
  const [authed, setAuthed] = useLocalJson(ADMIN_KEY, false);
  const [jobs, setJobs] = useLocalJson<Job[]>(EXTRA_JOBS_KEY, noJobs);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    employer: "",
    location: "",
    season_start: "",
    season_end: "",
    pay: "",
    housing_provided: true,
    language_required: "",
    visa_types_accepted: "Japan Working Holiday",
    hub: "niseko",
    headcount: "1",
    summary: "",
    commission_only: false,
    verified_employer: true,
  });

  function unlock(event: React.FormEvent) {
    event.preventDefault();
    if (secret !== MOCK_ADMIN_SECRET) {
      setError("Wrong mock admin secret.");
      return;
    }
    setAuthed(true);
    setError("");
  }

  function publish(event: React.FormEvent) {
    event.preventDefault();
    if (form.commission_only || !form.verified_employer) {
      setError("Rejected: unverified employer or commission-only role.");
      return;
    }
    const job: Job = {
      slug: slugify(`${form.employer}-${form.title}`),
      title: form.title,
      employer: form.employer,
      verified_employer: true,
      commission_only: false,
      location: form.location,
      hub: form.hub,
      season_start: form.season_start,
      season_end: form.season_end,
      pay: form.pay,
      housing_provided: form.housing_provided,
      language_required: form.language_required,
      visa_types_accepted: form.visa_types_accepted
        .split(",")
        .map((item) => item.trim()),
      role_types: ["hospitality"],
      headcount: Number(form.headcount),
      summary: form.summary,
      posted_at: new Date().toISOString().slice(0, 10),
    };
    setJobs([...jobs, job]);
    setError("");
  }

  if (!authed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin sign-in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={unlock} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="secret">Mock admin secret</Label>
              <Input
                id="secret"
                type="password"
                value={secret}
                onChange={(event) => setSecret(event.target.value)}
              />
            </div>
            <Button type="submit">Unlock</Button>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={publish} className="grid gap-3">
          {(
            [
              ["title", "Title"],
              ["employer", "Employer"],
              ["location", "Location"],
              ["season_start", "Season start"],
              ["season_end", "Season end"],
              ["pay", "Pay"],
              ["language_required", "Language required"],
              ["visa_types_accepted", "Visa types accepted"],
              ["hub", "Hub id"],
              ["headcount", "Headcount"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="grid gap-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type={
                  key.includes("season")
                    ? "date"
                    : key === "headcount"
                      ? "number"
                      : "text"
                }
                value={String(form[key])}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
                required
              />
            </div>
          ))}
          <div className="grid gap-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={form.summary}
              onChange={(event) =>
                setForm({ ...form, summary: event.target.value })
              }
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.housing_provided}
              onChange={(event) =>
                setForm({ ...form, housing_provided: event.target.checked })
              }
            />
            Housing provided
          </label>
          <Button type="submit">Publish</Button>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {jobs.length > 0 ? (
            <p className="text-sm" role="status">
              {jobs.length} extra listing{jobs.length === 1 ? "" : "s"} saved in
              this browser.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
