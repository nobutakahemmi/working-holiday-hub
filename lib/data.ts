import eligibilityFile from "@/data/eligibility.json";
import hubsFile from "@/data/hubs.json";
import jobsFile from "@/data/jobs.json";
import type { EligibilityRow, Hub, Interest, Job } from "@/lib/types";

export const DISCLAIMER =
  "Information only, not immigration advice. Always confirm on the official government page.";

export const eligibilityRows = eligibilityFile.rows as EligibilityRow[];
export const hubs = hubsFile.hubs as Hub[];
export const seedJobs = jobsFile.jobs as Job[];

const PASSPORT_SLUGS: Record<string, string> = {
  "United Kingdom": "uk-citizens",
  Australia: "australian-citizens",
  "New Zealand": "new-zealand-citizens",
  Canada: "canadian-citizens",
  Ireland: "irish-citizens",
  Germany: "german-citizens",
  France: "french-citizens",
  "South Korea": "south-korean-citizens",
  Taiwan: "taiwan-citizens",
  "United States": "us-citizens",
};

const DESTINATION_SLUGS: Record<string, string> = {
  Japan: "japan",
  "South Korea": "south-korea",
};

export function passportSlug(passport: string) {
  return PASSPORT_SLUGS[passport] ?? slugify(passport) + "-citizens";
}

export function destinationSlug(destination: string) {
  return DESTINATION_SLUGS[destination] ?? slugify(destination);
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function passportFromSlug(slug: string) {
  return (
    Object.entries(PASSPORT_SLUGS).find(([, value]) => value === slug)?.[0] ??
    null
  );
}

export function destinationFromSlug(slug: string) {
  return (
    Object.entries(DESTINATION_SLUGS).find(([, value]) => value === slug)?.[0] ??
    null
  );
}

export function uniquePassports() {
  return [...new Set(eligibilityRows.map((row) => row.passport))].sort();
}

export function uniqueDestinations() {
  return [...new Set(eligibilityRows.map((row) => row.destination))].sort();
}

export function findRow(destination: string, passport: string) {
  return eligibilityRows.find(
    (row) => row.destination === destination && row.passport === passport,
  );
}

export function hubsFor(destination: string, interests: Interest[] = []) {
  const inDestination = hubs.filter((hub) => hub.destination === destination);
  if (interests.length === 0) return inDestination;
  const matched = inDestination.filter((hub) =>
    hub.interests.some((tag) => interests.includes(tag)),
  );
  return matched;
}

export function formatQuota(quota: EligibilityRow["annual_quota"]) {
  if (quota === "unlimited") return "Unlimited (no published annual cap)";
  if (quota == null) return "TODO verify";
  return quota.toLocaleString("en-US") + " visas per year";
}

export function formatSecondStay(value: EligibilityRow["second_stay"]) {
  if (value === true) return "Yes";
  if (value === false) return "No (first-time participants only on the pages we checked)";
  if (value == null) return "TODO verify";
  return value;
}

export function formatAge(row: EligibilityRow) {
  if (row.age_min == null && row.age_max == null) return "TODO verify";
  if (row.age_min != null && row.age_max != null) {
    return `${row.age_min}–${row.age_max} at application`;
  }
  if (row.age_min != null) return `${row.age_min}+ at application`;
  return `Up to ${row.age_max} at application`;
}

export function publicJobs(jobs: Job[] = seedJobs) {
  return jobs.filter((job) => job.verified_employer && !job.commission_only);
}

export function seoPath(row: EligibilityRow) {
  return `/${destinationSlug(row.destination)}/${passportSlug(row.passport)}`;
}
