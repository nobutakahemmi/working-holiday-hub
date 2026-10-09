"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Disclaimer } from "@/components/disclaimer";
import { Fact } from "@/components/fact";
import {
  formatAge,
  formatQuota,
  formatSecondStay,
  seoPath,
  uniquePassports,
} from "@/lib/data";
import { matchEligibility } from "@/lib/match";
import { INTERESTS, type Interest } from "@/lib/types";

export function MatcherForm() {
  const passports = useMemo(() => uniquePassports(), []);
  const [passport, setPassport] = useState("");
  const [age, setAge] = useState("");
  const [startMonth, setStartMonth] = useState("2026-11");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(interest: Interest, checked: boolean) {
    setInterests((current) =>
      checked ? [...current, interest] : current.filter((item) => item !== interest),
    );
  }

  const results = useMemo(() => {
    if (!submitted || !passport || !age) return [];
    return matchEligibility({
      passport,
      age: Number(age),
      startMonth,
      interests,
    });
  }, [submitted, passport, age, startMonth, interests]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!passport) {
      setError("Choose the passport you will apply with.");
      return;
    }
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 16 || parsedAge > 80) {
      setError("Enter your age as a whole number.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Check where you can go</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Passport</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {passports.map((name) => (
                  <label
                    key={name}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-sm ${
                      passport === name
                        ? "border-foreground bg-muted"
                        : "border-input"
                    }`}
                  >
                    <input
                      type="radio"
                      name="passport"
                      value={name}
                      checked={passport === name}
                      onChange={() => setPassport(name)}
                      required
                    />
                    {name}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-2">
              <Label htmlFor="age">Age at application</Label>
              <Input
                id="age"
                name="age"
                type="number"
                inputMode="numeric"
                min={16}
                max={80}
                value={age}
                onChange={(event) => setAge(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start">Earliest start month</Label>
              <Input
                id="start"
                name="start"
                type="month"
                value={startMonth}
                onChange={(event) => setStartMonth(event.target.value)}
              />
            </div>
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Interests</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {INTERESTS.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={interests.includes(interest)}
                      onCheckedChange={(checked) =>
                        toggleInterest(interest, checked === true)
                      }
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </fieldset>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Show destinations</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPassport("United Kingdom");
                  setAge("24");
                  setStartMonth("2026-11");
                  setInterests(["ski/snow", "hospitality"]);
                  setError("");
                  setSubmitted(true);
                }}
              >
                Try UK winter example
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div aria-live="polite" className="grid gap-4">
        {!submitted ? (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Choose a passport and age to see Japan (and Korea, for US passports)
              against official partner lists. We do not invent missing visa numbers.
            </CardContent>
          </Card>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-sm">
              No destinations in this launch set use that passport. We currently
              cover Japan partners plus South Korea for United States passports.
            </CardContent>
          </Card>
        ) : (
          results.map(({ row, qualifies, reasons, hubs }) => (
            <Card key={`${row.destination}-${row.passport}`}>
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>{row.destination}</CardTitle>
                  <Badge variant={qualifies ? "default" : "secondary"}>
                    {qualifies ? "Looks eligible" : "Not eligible on current facts"}
                  </Badge>
                </div>
                <Disclaimer />
              </CardHeader>
              <CardContent className="grid gap-4">
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Fact label="Age range" value={formatAge(row)} />
                  <Fact
                    label="Maximum stay"
                    value={
                      row.max_stay_months == null
                        ? null
                        : `${row.max_stay_months} months`
                    }
                  />
                  <Fact label="Annual quota" value={formatQuota(row.annual_quota)} />
                  <Fact label="Fee" value={row.fee} />
                  <Fact label="Funds required" value={row.funds_required} />
                  <Fact
                    label="Second stay"
                    value={formatSecondStay(row.second_stay)}
                  />
                </dl>
                <Fact label="Work restrictions" value={row.work_restrictions} />
                {row.notes ? (
                  <p className="text-sm text-muted-foreground">{row.notes}</p>
                ) : null}
                <p className="text-sm">
                  Official source (verified {row.last_verified}):{" "}
                  <a
                    href={row.official_url}
                    className="underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {row.official_url}
                  </a>
                </p>
                <p className="text-sm">
                  Full page:{" "}
                  <a href={seoPath(row)} className="underline underline-offset-4">
                    {seoPath(row)}
                  </a>
                </p>
                <div>
                  <h3 className="text-sm font-medium">Matching hubs and seasons</h3>
                  {hubs.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No listed hub matches those interests yet. Farm and harvest
                      roles are not in the Japan launch set.
                    </p>
                  ) : (
                    <ul className="mt-2 grid gap-2">
                      {hubs.map((hub) => (
                        <li key={hub.id} className="rounded-md border p-3 text-sm">
                          <p className="font-medium">
                            {hub.name}, {hub.region}
                          </p>
                          <p className="text-muted-foreground">{hub.season}</p>
                          <p className="mt-1">{hub.typical_jobs.join(" · ")}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
