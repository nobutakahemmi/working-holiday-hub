import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpressInterest } from "@/components/express-interest";
import { Fact } from "@/components/fact";
import { Badge } from "@/components/ui/badge";
import { publicJobs, seedJobs } from "@/lib/data";

export function generateStaticParams() {
  return publicJobs().map((job) => ({ slug: job.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = seedJobs.find((item) => item.slug === slug);
  if (!job) return { title: "Job" };
  return {
    title: `${job.title} at ${job.employer}`,
    description: job.summary,
  };
}

export default async function JobPage({ params }: PageProps) {
  const { slug } = await params;
  const job = publicJobs().find((item) => item.slug === slug);
  if (!job) notFound();

  return (
    <article className="grid gap-6">
      <header className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{job.title}</h1>
          {job.housing_provided ? <Badge>Housing provided</Badge> : null}
        </div>
        <p className="text-muted-foreground">
          {job.employer} · {job.location}
        </p>
      </header>
      <p>{job.summary}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact label="Season" value={`${job.season_start} to ${job.season_end}`} />
        <Fact label="Pay" value={job.pay} />
        <Fact
          label="Housing"
          value={job.housing_provided ? "Provided" : "Not provided"}
        />
        <Fact label="Language" value={job.language_required} />
        <Fact label="Visas accepted" value={job.visa_types_accepted.join(", ")} />
        <Fact label="Headcount" value={String(job.headcount)} />
      </dl>
      <ExpressInterest slug={job.slug} title={job.title} />
    </article>
  );
}
