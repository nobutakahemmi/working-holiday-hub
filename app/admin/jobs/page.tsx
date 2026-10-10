import type { Metadata } from "next";
import { AdminJobs } from "@/components/admin-jobs";

export const metadata: Metadata = {
  title: "Admin job posting",
  robots: { index: false, follow: false },
};

export default function AdminJobsPage() {
  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Post a job</h1>
        <p className="max-w-2xl text-muted-foreground">
          Admin-only in this MVP. Use the mock secret from{" "}
          <code>.env.example</code>. Listings from unverified employers or
          commission-only sales roles are rejected.
        </p>
      </header>
      <AdminJobs />
    </div>
  );
}
