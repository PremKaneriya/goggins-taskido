// app/api/missed-tasks/route.ts
import { query } from "@/lib/db/database";
import { getUserFromRequest } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const userId = await getUserFromRequest(request);
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT
                id, title, description, due_date, is_completed, created_at
            FROM
                tasks
            WHERE
                user_id = $1 AND is_completed = FALSE AND due_date < NOW()
            ORDER BY
                due_date ASC
        `;

        const { rows } = await query(sql, [userId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "No tasks found" }, { status: 404 });
        }

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
};