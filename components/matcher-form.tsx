import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { INTERESTS, type Interest, type MatcherInput } from "@/lib/types";

function asArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseMatcherInput(
  searchParams: Record<string, string | string[] | undefined>,
): MatcherInput | null {
  const passport = String(searchParams.passport ?? "");
  const age = Number(searchParams.age);
  if (!passport || !Number.isInteger(age)) return null;
  const interests = asArray(searchParams.interests).filter((item): item is Interest =>
    INTERESTS.includes(item as Interest),
  );
  return {
    passport,
    age,
    startMonth: String(searchParams.start ?? ""),
    interests,
  };
}

export function MatcherForm({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const passports = uniquePassports();
  const input = parseMatcherInput(searchParams);
  const results = input ? matchEligibility(input) : null;
  const selectedInterests = new Set(input?.interests ?? asArray(searchParams.interests));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Check where you can go</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" action="/" className="grid gap-4">
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Passport</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {passports.map((name) => (
                  <label
                    key={name}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-input px-2.5 py-2 text-sm has-[:checked]:border-foreground has-[:checked]:bg-muted"
                  >
                    <input
                      type="radio"
                      name="passport"
                      value={name}
                      defaultChecked={String(searchParams.passport ?? "") === name}
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
                defaultValue={String(searchParams.age ?? "")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start">Earliest start month</Label>
              <Input
                id="start"
                name="start"
                type="month"
                defaultValue={String(searchParams.start ?? "2026-11")}
              />
            </div>
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Interests</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {INTERESTS.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      defaultChecked={selectedInterests.has(interest)}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit">Show destinations</Button>
              <Link
                className="text-sm underline underline-offset-4"
                href="/?passport=United+Kingdom&age=24&start=2026-11&interests=ski%2Fsnow&interests=hospitality"
              >
                Try UK winter example
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {results == null ? (
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
