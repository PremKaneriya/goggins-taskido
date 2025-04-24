// lib/db/tasks.ts

// Define or import the Task type
export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: Date;
  priority: number;
  project_id?: number;
  is_completed: boolean;
  created_at: Date;
}

import { getUserFromRequest } from "@/utils/session";
import { query } from "./database";
import { NextRequest } from "next/server";

// Get all tasks
export async function getTasks(
  req: NextRequest 
): Promise<Task[]> {

  const userId = await getUserFromRequest(req);

  const result = await query<Task>(
    'SELECT * FROM tasks WHERE is_deleted = false AND user_id = $1 AND is_completed = false ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

// Get tasks for a specific project
export async function getTasksByProject(projectId: number): Promise<Task[]> {
  const result = await query<Task>(
    'SELECT * FROM tasks WHERE project_id = $1 AND is_deleted = false ORDER BY created_at DESC',
    [projectId]
  );
  return result.rows;
}

// Get a single task by ID
export async function getTaskById(taskId: string): Promise<Task | undefined> {
  const result = await query<Task>(
    'SELECT * FROM tasks WHERE id = $1 AND is_deleted = false',
    [taskId]
  );
  return result.rows[0];
}

// Create a new task
export async function createTask(
  req: NextRequest,
  taskData: {
  title: string;
  description?: string;
  due_date?: Date;
  priority?: number;
  project_id?: number;
}): Promise<Task> {
  const { title, description, due_date, priority = 0, project_id } = taskData;

  const userId = await getUserFromRequest(req);

  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const result = await query<Task>(
    `INSERT INTO tasks (title, description, due_date, priority, project_id, is_completed, user_id)
     VALUES ($1, $2, $3, $4, $5, false, $6) RETURNING *`,
    [title, description, due_date, priority, project_id, userId]
  );
  
  return result.rows[0];
}

// Update an existing task
export async function updateTask(
  taskId: string, 
  updateData: Partial<Omit<Task, 'id' | 'created_at'>>
): Promise<Task | undefined> {
  const validTask = await getTaskById(taskId);
  if (!validTask) return undefined;
  
  const keys = Object.keys(updateData);
  if (keys.length === 0) return validTask;
  
  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = Object.values(updateData);
  
  const result = await query<Task>(
    `UPDATE tasks SET ${setClause} WHERE id = $1 RETURNING *`,
    [taskId, ...values]
  );
  
  return result.rows[0];
}

// Delete a task
export async function deleteTask(taskId: string): Promise<boolean> {
  const result = await query(
    `UPDATE tasks 
      SET 
        is_deleted = true,
        deleted_at = NOW()
        WHERE id = $1`,
    [taskId]
  );
  
  return (result.rowCount ?? 0) > 0;
}