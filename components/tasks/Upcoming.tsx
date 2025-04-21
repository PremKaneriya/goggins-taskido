// app/upcoming/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRightCircle } from 'lucide-react';
import Sidebar from '@/components/tasks/SideBar';

interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function UpcomingPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/upcoming', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 404 || response.status === 204) {
        setTasks([]); // Treat 404/204 as "no tasks found"
        return;
      }
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      if (errorMessage === 'No tasks found') {
        setTasks([]); // Handle specific "No tasks found" error
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Upcoming Tasks</h1>

          {loading ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading tasks...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-red-500 mb-4 sm:mb-6 text-center text-sm sm:text-base">Error: {error}</div>
              <button
                onClick={fetchTasks}
                className="w-full py-2 sm:py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">No upcoming tasks found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                    >
                      <ArrowRightCircle size={20} className="text-purple-500 sm:mt-1 shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800">{task.title}</h3>
                        {task.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500">
                          <Calendar size={14} className="sm:size-16" />
                          <span>Due: {formatDate(task.due_date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}