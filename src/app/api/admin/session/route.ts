import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function GET() {
  const ok = await isAdminRequest();
  return NextResponse.json({ authenticated: ok });
}
