import Link from "next/link";

const links = [
  { href: "/", label: "Matcher" },
  { href: "/japan", label: "Japan" },
  { href: "/jobs", label: "Jobs" },
  { href: "/employers", label: "Employers" },
  { href: "/account", label: "Profile" },
];

export function SiteHeader() {
  return (
    <header className="border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Working Holiday Hub
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
