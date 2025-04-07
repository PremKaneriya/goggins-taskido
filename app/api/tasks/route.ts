// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTasks, getTasksByProject, createTask } from '@/lib/db/tasks';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    
    let tasks;
    if (projectId) {
      tasks = await getTasksByProject(parseInt(projectId));
    } else {
      tasks = await getTasks();
    }
    
    return NextResponse.json(tasks);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const task = await createTask(data);

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}