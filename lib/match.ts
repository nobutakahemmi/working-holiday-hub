import { eligibilityRows, hubsFor } from "@/lib/data";
import type { MatchResult, MatcherInput } from "@/lib/types";

function monthLabel(startMonth: string) {
  if (!startMonth) return null;
  const [year, month] = startMonth.split("-").map(Number);
  if (!year || !month) return null;
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function matchEligibility(input: MatcherInput): MatchResult[] {
  const rows = eligibilityRows.filter((row) => row.passport === input.passport);
  return rows.map((row) => {
    const reasons: string[] = [];
    let qualifies = row.eligible;

    if (!row.eligible) {
      reasons.push(
        `${row.destination} does not offer a working holiday visa for ${row.passport} passports on the official partner list we checked.`,
      );
    }

    if (row.eligible && row.age_min != null && input.age < row.age_min) {
      qualifies = false;
      reasons.push(
        `Published minimum age is ${row.age_min}. You entered ${input.age}.`,
      );
    }

    if (row.eligible && row.age_max != null && input.age > row.age_max) {
      qualifies = false;
      reasons.push(
        `Published maximum age is ${row.age_max} at application. You entered ${input.age}.`,
      );
    }

    if (qualifies) {
      reasons.push(
        `This passport appears on the ${row.destination} working holiday partner list we verified on ${row.last_verified}.`,
      );
      if (row.age_min != null || row.age_max != null) {
        reasons.push(`Your age (${input.age}) is inside the published range.`);
      }
      const start = monthLabel(input.startMonth);
      if (start) {
        reasons.push(`Earliest start month used for hub/season matching: ${start}.`);
      }
    }

    const hubs = qualifies
      ? hubsFor(row.destination, input.interests)
      : hubsFor(row.destination);

    return { row, qualifies, reasons, hubs };
  });
}
