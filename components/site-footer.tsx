import Link from "next/link";
import { DISCLAIMER } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground">
        <p>{DISCLAIMER}</p>
        <p>
          Launching with Japan for the 2026–27 winter.{" "}
          <Link href="/japan" className="underline underline-offset-4">
            Japan hubs
          </Link>
          {" · "}
          <Link href="/admin/jobs" className="underline underline-offset-4">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
