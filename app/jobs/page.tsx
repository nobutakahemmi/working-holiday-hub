import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicJobs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Curated working holiday jobs",
  description:
    "Verified winter jobs in Japan. Housing, pay, language, and visa types — no commission-only listings.",
};

export default function JobsPage() {
  const jobs = publicJobs();

  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Curated jobs</h1>
        <p className="max-w-2xl text-muted-foreground">
          Only verified employers. Commission-only and sales roles are not
          listed. Express interest from a job page — we email the host with
          your profile. There is no public application form.
        </p>
      </header>
      {jobs.length === 0 ? (
        <p>No jobs are listed yet. Join the waitlist on the home page.</p>
      ) : (
        <ul className="grid gap-4">
          {jobs.map((job) => (
            <li key={job.slug}>
              <Card>
                <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
                  <CardTitle>
                    <Link href={`/jobs/${job.slug}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </CardTitle>
                  {job.housing_provided ? <Badge>Housing provided</Badge> : null}
                </CardHeader>
                <CardContent className="grid gap-1 text-sm">
                  <p>
                    {job.employer} · {job.location}
                  </p>
                  <p className="text-muted-foreground">
                    {job.season_start} to {job.season_end} · {job.pay}
                  </p>
                  <p>{job.summary}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
