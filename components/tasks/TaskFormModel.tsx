import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FlagIcon, FolderIcon, XIcon, Loader2 } from 'lucide-react';

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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
          <button 
            onClick={onClose} 
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close modal"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-gray-700">
              Task Name*
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              required
            />
          </div>

          <div>
            <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="task-description"
              placeholder="Add details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-due-date" className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarIcon size={16} className="text-emerald-500" />
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label htmlFor="task-priority" className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <FlagIcon size={16} className="text-emerald-500" />
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
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
              <label htmlFor="task-project" className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <FolderIcon size={16} className="text-emerald-500" />
                Project
              </label>
              <select
                id="task-project"
                value={projectId || ''}
                onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="">Inbox (No Project)</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}