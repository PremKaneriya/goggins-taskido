import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { Task } from '@/lib/db/tasks';
import { PlusIcon, FileDown } from 'lucide-react';

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
  const [pdfLoading, setPdfLoading] = useState(false);

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
      <div className="flex h-32 items-center justify-center">
        <svg
          className="h-5 w-5 animate-spin text-[#db4c3f]"
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded bg-red-50 p-3 text-center text-xs text-[#db4c3f]">
        {error}
      </div>
    );
  }

  const getProjectName = (projectId?: number) => {
    if (!projectId) return undefined;
    const project = projects.find((p) => p.id === projectId);
    return project?.name;
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.is_completed;
    if (filter === 'completed') return task.is_completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="rounded bg-white p-4 text-center shadow-sm">
        <p className="text-sm text-gray-600">No tasks yet.</p>
        <button
          onClick={onOpenTaskForm}
          className="mt-1 inline-flex items-center gap-1 text-xs text-[#db4c3f] hover:underline"
        >
          <PlusIcon size={12} />
          Add a task
        </button>
      </div>
    );
  }

  return (
    <div className="rounded bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-medium text-gray-900">Inbox</h2>
        <div className="flex gap-2">
          <button
            onClick={onOpenTaskForm}
            className="flex items-center gap-1 rounded bg-[#db4c3f] px-2 py-1 text-xs text-white hover:bg-[#c13b31]"
          >
            <PlusIcon size={12} />
            Add Task
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading || tasks.length === 0}
            className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {pdfLoading ? (
              <>
                <svg
                  className="mr-1 h-3 w-3 animate-spin"
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
                <FileDown size={12} />
                Export
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-3 flex gap-1">
        {/* {['All', 'Active', 'Completed'].map((f) => ( */}
        {['All'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f.toLowerCase() as any)}
            className={`rounded px-2 py-0.5 text-xs ${
              filter === f.toLowerCase()
                ? 'bg-[#db4c3f] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-1">
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
    </div>
  );
}