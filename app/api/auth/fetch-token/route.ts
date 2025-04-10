import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_session")?.value || null;
  
  return NextResponse.json({ token });
}
