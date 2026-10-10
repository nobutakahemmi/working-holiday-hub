import type { Metadata } from "next";
import { AccountPanel } from "@/components/account-panel";

export const metadata: Metadata = {
  title: "Profile and sign-in",
  description:
    "Mock magic-link sign-in and a light working holiday profile. Supabase is not required for local use.",
};

export default function AccountPage() {
  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Your profile</h1>
        <p className="max-w-2xl text-muted-foreground">
          Sign-in is a local mock of Supabase magic links. Nothing is sent to a
          real inbox. Your profile stays in this browser until we connect
          Postgres.
        </p>
      </header>
      <AccountPanel />
    </div>
  );
}
