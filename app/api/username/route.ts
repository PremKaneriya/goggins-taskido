// app/api/username/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/session";
import { query } from "@/lib/db/database";

export async function GET(request: NextRequest) {
  const userId = await getUserFromRequest(request);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = `
      SELECT
        u.full_name
      FROM
        public.users u
      WHERE
        u.id = $1
      LIMIT 1
    `;

    const { rows } = await query(sql, [userId]);
    console.log('rows', rows);
    if (rows.length === 0) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const username = rows[0].full_name;

    return NextResponse.json({ username });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the username." },
      { status: 500 }
    );
  }
}