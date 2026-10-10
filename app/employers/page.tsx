import type { Metadata } from "next";
import { EmployerForm } from "@/components/employer-form";

export const metadata: Metadata = {
  title: "Employer interest",
  description:
    "Tell us about winter hiring in Japan. We only work with verified businesses — no commission-only sales roles.",
};

export default function EmployersPage() {
  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Hire working holiday makers
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          For inns, hostels, and ski resorts that can verify who they are. We
          do not take commission-only or sales listings.
        </p>
      </header>
      <EmployerForm />
    </div>
  );
}
