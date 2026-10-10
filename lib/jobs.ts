import { publicJobs, seedJobs } from "@/lib/data";
import { EXTRA_JOBS_KEY, readJson } from "@/lib/storage";
import type { Job } from "@/lib/types";

export function allJobs(): Job[] {
  const extra = readJson<Job[]>(EXTRA_JOBS_KEY, []);
  return publicJobs([...seedJobs, ...extra]);
}

export function findJob(slug: string, extra: Job[] = []) {
  return publicJobs([...seedJobs, ...extra]).find((job) => job.slug === slug);
}
