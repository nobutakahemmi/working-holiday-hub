import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/disclaimer";
import { Fact } from "@/components/fact";
import {
  destinationFromSlug,
  eligibilityRows,
  formatAge,
  formatQuota,
  formatSecondStay,
  hubsFor,
  passportFromSlug,
  seoPath,
} from "@/lib/data";

export function generateStaticParams() {
  return eligibilityRows.map((row) => {
    const path = seoPath(row).slice(1).split("/");
    return { destination: path[0], passport: path[1] };
  });
}

type PageProps = {
  params: Promise<{ destination: string; passport: string }>;
};

function resolveRow(destinationSlug: string, passportSlug: string) {
  const destination = destinationFromSlug(destinationSlug);
  const passport = passportFromSlug(passportSlug);
  if (!destination || !passport) return null;
  return (
    eligibilityRows.find(
      (row) => row.destination === destination && row.passport === passport,
    ) ?? null
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { destination, passport } = await params;
  const row = resolveRow(destination, passport);
  if (!row) return { title: "Visa page" };
  const title = `${row.destination} working holiday for ${row.passport} citizens`;
  const description = row.eligible
    ? `Eligibility facts for ${row.passport} citizens applying to the ${row.destination} working holiday programme. Age, stay, quota, and the official source.`
    : `${row.passport} citizens are not eligible for a ${row.destination} working holiday visa on the official partner list we checked.`;
  return { title, description };
}

export default async function VisaPage({ params }: PageProps) {
  const { destination, passport } = await params;
  const row = resolveRow(destination, passport);
  if (!row) notFound();

  const hubs = hubsFor(row.destination);
  const title = `${row.destination} working holiday for ${row.passport} citizens`;
  const faqs = [
    {
      question: `Can ${row.passport} citizens get a ${row.destination} working holiday visa?`,
      answer: row.eligible
        ? `Yes, ${row.passport} is on the partner list we verified on ${row.last_verified}. Confirm the current rules on the official page before you apply.`
        : `No. ${row.passport} is not a ${row.destination} working holiday partner on the official list we checked on ${row.last_verified}.`,
    },
    {
      question: "What age range is published?",
      answer: formatAge(row),
    },
    {
      question: "Where do these facts come from?",
      answer: `Every figure on this page comes from ${row.official_url}, last checked on ${row.last_verified}. Fields marked TODO verify were not confirmed on that page.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <article className="grid gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="grid gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <Disclaimer />
      </header>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact label="Eligible" value={row.eligible ? "Yes" : "No"} />
        <Fact label="Age" value={formatAge(row)} />
        <Fact
          label="Maximum stay"
          value={row.max_stay_months == null ? null : `${row.max_stay_months} months`}
        />
        <Fact label="Annual quota" value={formatQuota(row.annual_quota)} />
        <Fact label="Fee" value={row.fee} />
        <Fact label="Funds required" value={row.funds_required} />
        <Fact label="Second stay" value={formatSecondStay(row.second_stay)} />
        <Fact label="Last verified" value={row.last_verified} />
      </dl>
      <Fact label="Work restrictions" value={row.work_restrictions} />
      {row.notes ? <p className="text-sm text-muted-foreground">{row.notes}</p> : null}
      <p className="text-sm">
        Official source:{" "}
        <a
          href={row.official_url}
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          {row.official_url}
        </a>
      </p>
      {row.destination === "Japan" ? (
        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Japan hubs</h2>
          <ul className="grid gap-2">
            {hubs.map((hub) => (
              <li key={hub.id} className="rounded-lg border p-4 text-sm">
                <p className="font-medium">
                  {hub.name}, {hub.region}
                </p>
                <p className="text-muted-foreground">{hub.season}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">FAQ</h2>
        {faqs.map((item) => (
          <div key={item.question}>
            <h3 className="font-medium">{item.question}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
