'use client';

import React, { useState, useEffect } from 'react';
import { FolderIcon, CalendarIcon } from 'lucide-react';
import Sidebar from '@/components/tasks/SideBar';

interface Project {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export default function CompletedProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/completed-projects', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 204) {
        setProjects([]);
        return;
      }
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Completed Projects</h1>

          {loading ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-red-500 mb-4 sm:mb-6 text-center text-sm sm:text-base">Error: {error}</div>
              <button
                onClick={fetchProjects}
                className="w-full py-2 sm:py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">No completed projects found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                    >
                      <FolderIcon size={20} className="text-indigo-500 sm:mt-1 shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800">{project.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500">
                          <CalendarIcon size={14} className="sm:size-16" />
                          <span>Created: {formatDate(project.created_at)}</span>
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