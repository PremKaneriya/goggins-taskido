import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { Task } from '@/lib/db/tasks';
import { PlusIcon, FileDown, ChevronDown, Search, Filter } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onCompleteTask: (id: number, isCompleted: boolean) => void;
  onDeleteTask: (id: number) => void;
  onOpenTaskForm: () => void;
  projects?: { id: number; name: string }[];
}

export default function TaskList({
  tasks,
  isLoading,
  error,
  onCompleteTask,
  onDeleteTask,
  onOpenTaskForm,
  projects = [],
}: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true);
      window.location.href = '/api/tasks/pdf';
      setTimeout(() => setPdfLoading(false), 2000);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setPdfLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white/50 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-emerald-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center shadow-sm">
        <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-medium text-red-800">Error Loading Tasks</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const getProjectName = (projectId?: number) => {
    if (!projectId) return undefined;
    const project = projects.find((p) => p.id === projectId);
    return project?.name;
  };

  // Apply filters and search
  const filteredTasks = tasks
    .filter((task) => {
      // Status filter
      if (filter === 'active' && task.is_completed) return false;
      if (filter === 'completed' && !task.is_completed) return false;
      
      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) || 
          (task.description && task.description.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by completion status first
      if (a.is_completed !== b.is_completed) {
        return a.is_completed ? 1 : -1;
      }
      
      // Then by priority (high to low)
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      
      // Then by due date (if available)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      
      return 0;
    });

  if (filteredTasks.length === 0 && !searchQuery) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">No tasks yet</h3>
        <p className="mb-6 text-sm text-gray-500">Let's get started by creating your first task</p>
        <button
          onClick={onOpenTaskForm}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <PlusIcon size={16} />
          Add Your First Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Filter size={16} />
            Filter
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading || tasks.length === 0}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {pdfLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <FileDown size={16} />
                Export
              </>
            )}
          </button>

          <button
            onClick={onOpenTaskForm}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            <PlusIcon size={16} />
            Add Task
          </button>
        </div>
      </div>

      {/* Filters & Search Panel */}
      <div className={`${showFilters ? 'block' : 'hidden'} rounded-xl bg-white p-4 shadow-sm`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="search-tasks" className="mb-1 block text-xs font-medium text-gray-700">
              Search Tasks
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                id="search-tasks"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by task name or description"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Status Filter</label>
            <div className="flex space-x-1 rounded-lg border border-gray-300 p-1">
              {['All', 'Active', 'Completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f.toLowerCase() as any)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    filter === f.toLowerCase()
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Summary */}
      {searchQuery && (
        <div className="rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-700">
          {filteredTasks.length === 0 ? (
            <p>No tasks found matching "{searchQuery}"</p>
          ) : (
            <p>
              Found {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} matching "{searchQuery}"
            </p>
          )}
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={onCompleteTask}
              onDelete={onDeleteTask}
              projectName={getProjectName(task.project_id)}
            />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No matching tasks</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or clear filters</p>
        </div>
      ) : null}
    </div>
  );
}