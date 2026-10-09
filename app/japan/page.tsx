import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { eligibilityRows, hubsFor, publicJobs, seoPath } from "@/lib/data";

export const metadata: Metadata = {
  title: "Japan working holiday hubs",
  description:
    "Seasons, job types, and how to get hired in Niseko, Hakuba, Tokyo, Kyoto, and Okinawa on a Japan working holiday visa.",
};

export default function JapanPage() {
  const japanRows = eligibilityRows.filter((row) => row.destination === "Japan");
  const hubs = hubsFor("Japan");
  const jobs = publicJobs().filter((job) => job.location.includes("Japan"));

  return (
    <article className="grid gap-8">
      <header className="grid gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Japan</h1>
        <p className="max-w-2xl text-muted-foreground">
          We are lining up 2026–27 winter roles with ski resorts in Niseko and
          Hakuba, plus inns and hostels in the cities. Use the matcher first —
          the United States is not a Japan working holiday partner.
        </p>
        <Disclaimer />
      </header>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Seasons</h2>
        <ul className="grid gap-2">
          {hubs.map((hub) => (
            <li key={hub.id} className="rounded-lg border p-4">
              <h3 className="font-medium">
                {hub.name}, {hub.region}
              </h3>
              <p className="text-sm text-muted-foreground">{hub.season}</p>
              <p className="mt-2 text-sm">{hub.typical_jobs.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">How to get a job</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Confirm your passport on the{" "}
            <Link href="/" className="underline underline-offset-4">
              eligibility matcher
            </Link>{" "}
            and on the official government page.
          </li>
          <li>
            Apply for the visa at the Japanese embassy or consulate that covers
            where you live. Do not travel first and hope to switch status.
          </li>
          <li>
            Write a short profile: dates, Japanese level, and past seasonal
            work. Inns and ski towns hire people who can stay a full winter.
          </li>
          <li>
            Browse{" "}
            <Link href="/jobs" className="underline underline-offset-4">
              curated jobs
            </Link>
            . We only list verified employers. No commission-only sales roles.
          </li>
          <li>
            Use Express interest so we can introduce you. There is no public
            apply button yet.
          </li>
        </ol>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Open winter listings</h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No Japan jobs posted yet.</p>
        ) : (
          <ul className="grid gap-2">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link href={`/jobs/${job.slug}`} className="text-sm underline underline-offset-4">
                  {job.title} · {job.employer}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Pages by passport</h2>
        <ul className="grid gap-1 text-sm">
          {japanRows.map((row) => (
            <li key={row.passport}>
              <Link href={seoPath(row)} className="underline underline-offset-4">
                {row.passport}
                {row.eligible ? "" : " (not eligible)"}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
