import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FlagIcon, FolderIcon, XIcon } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
  isSubmitting = false,
}: TaskFormModalProps) {
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-12 sm:items-center sm:pt-0">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Add Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Task name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-gray-200 p-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#db4c3f] focus:outline-none focus:ring-1 focus:ring-[#db4c3f]/30"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-200 p-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#db4c3f] focus:outline-none focus:ring-1 focus:ring-[#db4c3f]/30"
            rows={2}
          />

          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[120px]">
              <label className="mb-1 flex items-center gap-1 text-xs text-gray-600">
                <CalendarIcon size={12} />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
                className="w-full rounded border border-gray-200 p-1.5 text-xs text-gray-900 focus:border-[#db4c3f] focus:outline-none focus:ring-1 focus:ring-[#db4c3f]/30"
              />
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="mb-1 flex items-center gap-1 text-xs text-gray-600">
                <FlagIcon size={12} />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full rounded border border-gray-200 p-1.5 text-xs text-gray-900 focus:border-[#db4c3f] focus:outline-none focus:ring-1 focus:ring-[#db4c3f]/30"
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
                <option value={3}>Urgent</option>
              </select>
            </div>
          </div>

          {projects.length > 0 && (
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs text-gray-600">
                <FolderIcon size={12} />
                Project
              </label>
              <select
                value={projectId || ''}
                onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded border border-gray-200 p-1.5 text-xs text-gray-900 focus:border-[#db4c3f] focus:outline-none focus:ring-1 focus:ring-[#db4c3f]/30"
              >
                <option value="">Inbox</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 rounded bg-[#db4c3f] py-2 text-xs font-medium text-white hover:bg-[#c13b31] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="inline mr-1 h-3 w-3 animate-spin"
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
                  Adding...
                </>
              ) : (
                'Add Task'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded bg-gray-100 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}