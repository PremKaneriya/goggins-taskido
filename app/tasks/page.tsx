'use client';

import React, { useEffect, useState } from 'react';
import TaskList from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/tasks/SideBar';
import TaskFormModal from '@/components/tasks/TaskFormModel';

export default function TasksPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch('/api/auth/fetch-token', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        if (!data.token) {
          router.push('/login');
        } 
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, [router]);

  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks();

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
        due_date: taskData.due_date || undefined,
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
    <div className="flex min-h-screen w-full bg-[#fafafa]">
      <Sidebar projects={[]} />
      <div className="flex-1 p-3 sm:p-4 lg:p-6">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
          onOpenTaskForm={() => setIsTaskFormOpen(true)}
          projects={[]}
        />
        <TaskFormModal
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleCreateTask}
          isSubmitting={isSubmitting}
          projects={[]}
        />
      </div>
    </div>
  );
}