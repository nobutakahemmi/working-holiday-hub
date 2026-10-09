import { NextResponse } from "next/server";
import { publicJobs } from "@/lib/data";

const inbox: unknown[] = [];

export async function POST(request: Request) {
  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    profile?: { email?: string; passport?: string };
  };

  const job = publicJobs().find((item) => item.slug === body.slug);
  if (!job) {
    return NextResponse.json({ error: "Unknown job." }, { status: 404 });
  }
  if (!body.profile?.email || !body.profile.passport) {
    return NextResponse.json({ error: "Profile required." }, { status: 400 });
  }

  inbox.push({
    to: process.env.HOST_INBOX_EMAIL ?? "host@localhost",
    provider: "mock-resend",
    job: job.title,
    profile: body.profile,
    at: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    provider: "mock-resend",
    queued: inbox.length,
  });
}
