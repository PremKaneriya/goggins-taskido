// app/api/projects/route.ts
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
                *
            FROM
                projects
            WHERE
                user_id = $1
            ORDER BY
                created_at DESC
        `;

        const { rows } = await query(sql, [userId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "No projects found" }, { status: 404 });
        }

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
};  

export const POST = async (request: NextRequest) => {
    try {
        const userId = await getUserFromRequest(request);
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, description, tasks_ids } = await request.json();

        // Using parameterized query to prevent SQL injection
        const sql = `
        INSERT INTO projects (user_id, title, description, tasks_ids, created_at)
        VALUES ($1, $2, $3, $4::uuid[], NOW())
        RETURNING *
      `;
      
      const { rows } = await query(sql, [userId, title, description, tasks_ids]);
      

        if (rows.length === 0) {
            return NextResponse.json({ message: "Project not created" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
};

export const DELETE = async (request: NextRequest) => {
    try {
        const userId = await getUserFromRequest(request);
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ message: "Missing id" }, { status: 400 });
        }

        // Using parameterized query to prevent SQL injection
        const sql = `
            UPDATE projects
            SET is_deleted = TRUE
            WHERE id = $1 AND user_id = $2
            RETURNING id, title, description, created_at
        `;

        const { rows } = await query(sql, [id, userId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
};

export const PUT = async (request: NextRequest) => {
    try {
        const userId = await getUserFromRequest(request);
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id, title, description } = await request.json();

        if (!id || !title || !description) {
            return NextResponse.json({ message: "Missing id, title or description" }, { status: 400 });
        }

        // Using parameterized query to prevent SQL injection
        const sql = `
            UPDATE projects
            SET title = $2, description = $3
            WHERE id = $1 AND user_id = $4
            RETURNING id, title, description, created_at
        `;

        const { rows } = await query(sql, [id, title, description, userId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
};