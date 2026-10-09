import { MatcherForm } from "@/components/matcher-form";
import { WaitlistForm } from "@/components/waitlist-form";

export default function HomePage() {
  return (
    <div className="grid gap-10">
      <section className="grid gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Japan first · 2026–27 winter
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Find a working holiday that actually fits your passport
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Built for people heading to ski towns, inns, and hostels — starting
          with Niseko, Hakuba, Tokyo, Kyoto, and Okinawa. Every visa fact comes
          from a government page. Missing numbers stay blank.
        </p>
      </section>
      <MatcherForm />
      <WaitlistForm />
    </div>
  );
}
