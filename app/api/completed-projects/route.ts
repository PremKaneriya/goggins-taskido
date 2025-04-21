import { query } from "@/lib/db/database";
import { getUserFromRequest } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const userId = await getUserFromRequest(request);
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const sql = `
            SELECT
                *
            FROM
                projects
            WHERE
                status = 'completed' AND user_id = $1 AND is_deleted = FALSE
            ORDER BY
                created_at DESC
        `;

        const { rows } = await query(sql, [userId]);

        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error("Error fetching completed projects:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};