import { NextResponse } from "next/server";

const submissions: unknown[] = [];

export async function POST(request: Request) {
  const body = (await request.json()) as {
    businessName?: string;
    location?: string;
    website?: string;
    roleTypes?: string;
    headcount?: string;
    season?: string;
  };

  if (
    !body.businessName ||
    !body.location ||
    !body.website ||
    !body.roleTypes ||
    !body.headcount ||
    !body.season
  ) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const role = body.roleTypes.toLowerCase();
  if (role.includes("commission-only") || role.includes("commission only")) {
    return NextResponse.json(
      { error: "Commission-only roles are not accepted." },
      { status: 400 },
    );
  }

  submissions.push({ ...body, at: new Date().toISOString() });
  return NextResponse.json({ ok: true, stored: submissions.length });
}
