import { query } from "@/lib/db/database";
import { getUserFromRequest } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
    try {
        const userId = await getUserFromRequest(request);
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get request body
        const body = await request.json();
        const { full_name, email } = body;
        
        // Validate input
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
        }

        // Start with empty updates object
        const updates: Record<string, any> = {};
        const params: any[] = [];
        let paramCount = 1;
        
        // Only add fields that were actually provided
        if (full_name !== undefined) {
            updates.full_name = full_name;
            params.push(full_name);
        }
        
        if (email !== undefined) {
            updates.email = email;
            params.push(email);
        }
        
        // We don't need to update any timestamp as it's not in the schema
        
        // If no fields to update, return early
        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: "No fields to update" }, { status: 400 });
        }
        
        // Build SET clause for SQL
        const setClause = Object.entries(updates)
            .map(([key, value]) => `${key} = ${paramCount++}`)
            .join(', ');
        
        // Add userId to params
        params.push(userId);
        
        const sql = `
            UPDATE users
            SET ${setClause}
            WHERE id = $${paramCount}
            RETURNING id, email, full_name, created_at, last_login, is_deleted, deleted_at
        `;

        const { rows } = await query(sql, params);
        
        if (rows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: rows[0]
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
};

export const GET = async (request: NextRequest) => {
    try {
        const userId = await getUserFromRequest(request);
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT
                id, email, full_name, created_at, last_login, is_deleted, deleted_at
            FROM
                users
            WHERE
                id = $1 AND is_deleted = FALSE
        `;

        const { rows } = await query(sql, [userId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Don't send sensitive information back to client
        const user = rows[0];

        return NextResponse.json({
            message: "User found",
            user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
};