'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, AlertCircle, FolderIcon } from 'lucide-react';
import Sidebar from '@/components/tasks/SideBar';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
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
  tasks: Task[];
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch project');
      }
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl w-full">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Project Details</h1>
            <Link
              href="/new-project"
              className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base font-medium"
            >
              Back to Projects
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading project...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start text-red-500 mb-4 sm:mb-6 text-sm sm:text-base">
                <AlertCircle className="mr-2 mt-0.5" size={20} />
                <span>Error: {error}</span>
              </div>
              <button
                onClick={fetchProject}
                className="w-full py-2 sm:py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : !project ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">Project not found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <FolderIcon size={24} className="text-indigo-500 sm:mt-1 shrink-0" />
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{project.title}</h2>
                      {project.description && (
                        <p className="text-sm sm:text-base text-gray-600 mt-2">{project.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500">
                        <Clock size={16} />
                        {project.created_at ? (
                          <span>Created: {formatDate(project.created_at)}</span>
                        ) : (
                          <span>Created: N/A</span>
                        )}
                      </div>
                      {project.status && (
                        <span
                          className={`inline-block mt-2 px-2.5 py-1 text-xs sm:text-sm font-medium rounded-full ${
                            project.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {project.status === 'in-progress'
                            ? 'In Progress'
                            : project.status === 'completed'
                            ? 'Completed'
                            : 'Not Started'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Associated Tasks</h3>
                    {project.tasks.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4">
                        {project.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center mt-1"></div>
                            <span className="text-sm sm:text-base text-gray-700">{task.title}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">No tasks associated with this project.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}