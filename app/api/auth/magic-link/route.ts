import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const token = "mock-" + Buffer.from(email).toString("base64url");
  const url = `/account?token=${token}&email=${encodeURIComponent(email)}`;
  return NextResponse.json({
    url,
    provider: "mock-supabase",
    message: "Magic link mocked. No email was sent.",
  });
}
