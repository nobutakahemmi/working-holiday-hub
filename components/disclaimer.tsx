import { DISCLAIMER } from "@/lib/data";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 ${className}`}
      role="note"
    >
      {DISCLAIMER}
    </p>
  );
}
