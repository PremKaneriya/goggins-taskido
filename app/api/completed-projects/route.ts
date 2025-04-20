// app/api/completed-projects/route.ts

import { query } from "@/lib/db/database";

export const GET = async () => {
    try {
        
        const sql = `
            SELECT
                *
            FROM
                public.projects
            WHERE
                status = 'completed'
            ORDER BY
                created_at DESC
        `;

        const { rows } = await query(sql);

        if (rows.length === 0) {
            return new Response("No completed projects found.", { status: 204 });
        }

        return new Response(JSON.stringify(rows), { status: 200 });

    } catch (error) {
        console.error("Error fetching completed projects:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}