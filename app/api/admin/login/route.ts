import { setAdminSessionCookie, validateAdminPassword } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    if (!body.password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }
    if (!validateAdminPassword(body.password)) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }
    await setAdminSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not log in." }, { status: 500 });
  }
}
