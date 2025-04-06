// app/tasks/page.tsx
'use client';

import React, { useState } from 'react';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import { useTasks } from '@/hooks/useTasks';

export default function TasksPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    tasks, 
    isLoading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useTasks();

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    due_date?: Date | null;
    priority: number;
    project_id?: number;
  }) => {
    try {
      setIsSubmitting(true);
      await createTask({
        ...taskData,
        due_date: taskData.due_date || undefined
      });
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async (taskId: number, isCompleted: boolean) => {
    try {
      await updateTask(taskId, { is_completed: isCompleted });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-widest">Goggins Taskido</h1>
        <p className="text-gray-700 mt-2 font-medium uppercase">WHO’S GONNA CARRY THE BOATS?</p>
      </div>
      
      <div className="mb-12">
        <TaskForm 
          onSubmit={handleCreateTask} 
          isSubmitting={isSubmitting}
        />
      </div>
      
      <TaskList 
        tasks={tasks} 
        isLoading={isLoading} 
        error={error}
        onCompleteTask={handleCompleteTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}