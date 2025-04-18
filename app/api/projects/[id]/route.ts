// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/session";
import { query } from "@/lib/db/database";

// Define the expected project and task shapes
interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null; // Assuming date is returned as string
  priority: number;
  is_completed: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string | null;
  status?: string;
  user_id: string;
  tasks: Task[]; // Updated to include full task objects
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserFromRequest(request);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const projectId = params.id;

  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json({ message: "Invalid project ID." }, { status: 400 });
  }

  try {
    const sql = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.created_at,
        p.user_id,
        json_agg(
          json_build_object(
            'id', t.id,
            'title', t.title,
            'description', t.description,
            'due_date', t.due_date,
            'priority', t.priority,
            'is_completed', t.is_completed
          )
        ) FILTER (WHERE t.id IS NOT NULL) AS tasks
      FROM
        public.projects p
      LEFT JOIN LATERAL unnest(p.tasks_ids) WITH ORDINALITY AS u(task_id) ON true
      LEFT JOIN public.tasks t ON t.id = u.task_id AND t.is_deleted = false
      WHERE
        p.id = $1
        AND p.user_id = $2
        AND p.is_deleted = false
      GROUP BY
        p.id,
        p.title,
        p.description,
        p.created_at,
        p.user_id
      ORDER BY
        p.created_at DESC
      LIMIT 1
    `;

    const { rows } = await query(sql, [projectId, userId]);

    if (rows.length === 0) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const project = rows[0] as Project;

    // Validate created_at
    if (project.created_at && isNaN(new Date(project.created_at).getTime())) {
      return NextResponse.json(
        { message: "Invalid created_at value in project data." },
        { status: 400 }
      );
    }

    // Ensure tasks is an array, even if empty
    project.tasks = project.tasks || [];

    return NextResponse.json(project);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the project." },
      { status: 500 }
    );
  }
}