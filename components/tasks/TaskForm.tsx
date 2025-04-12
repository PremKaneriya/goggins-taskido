import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FlagIcon, FolderIcon, PlusIcon } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    description?: string;
    due_date?: Date | null;
    priority: number;
    project_id?: number;
  }) => void;
  projects?: { id: number; name: string }[];
  isSubmitting?: boolean;
}

export default function TaskForm({ onSubmit, projects = [], isSubmitting = false }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState(0);
  const [projectId, setProjectId] = useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate,
      priority,
      project_id: projectId,
    });

    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority(0);
    setProjectId(undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl bg-white/30 p-6 backdrop-blur-md sm:p-8"
      style={{ boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)' }}
    >
      <div className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-white/50 bg-transparent p-4 text-lg font-medium text-gray-900 placeholder-gray-500 transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200/50"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-white/50 bg-transparent p-4 text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200/50"
            rows={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <CalendarIcon size={16} className="text-blue-400" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full rounded-lg border border-white/50 bg-transparent p-3 text-gray-800 transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200/50"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FlagIcon size={16} className="text-blue-400" />
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full rounded-lg border border-white/50 bg-transparent p-3 text-gray-800 transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200/50"
            >
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
              <option value={3}>Urgent</option>
            </select>
          </div>

          {projects.length > 0 && (
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <FolderIcon size={16} className="text-blue-400" />
                Project
              </label>
              <select
                value={projectId || ''}
                onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-lg border border-white/50 bg-transparent p-3 text-gray-800 transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200/50"
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 py-3 text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
        >
          {isSubmitting ? (
            <>
              <svg
                className="mr-2 h-5 w-5 animate-spin text-white"
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
              Adding...
            </>
          ) : (
            <>
              <PlusIcon size={18} />
              Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}