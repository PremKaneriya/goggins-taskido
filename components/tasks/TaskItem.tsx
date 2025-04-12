import { Task } from '@/lib/db/tasks';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FlagIcon, Trash2Icon, MoreVerticalIcon, FolderIcon, CheckCircle2, Circle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onComplete: (id: number, isCompleted: boolean) => void;
  onDelete: (id: number) => void;
  projectName?: string;
}

export default function TaskItem({ task, onComplete, onDelete, projectName }: TaskItemProps) {
  const { id, title, description, due_date, priority, is_completed } = task;
  const [showActions, setShowActions] = useState(false);

  const priorityBadges = {
    0: { color: 'bg-gray-100 text-gray-600', label: 'Low' },
    1: { color: 'bg-blue-100 text-blue-600', label: 'Medium' },
    2: { color: 'bg-orange-100 text-orange-600', label: 'High' },
    3: { color: 'bg-red-100 text-red-600', label: 'Urgent' },
  };

  const handleCheckboxChange = () => {
    onComplete(id, !is_completed);
  };

  const isPastDue = due_date && new Date(due_date) < new Date() && !is_completed;

  return (
    <div
      className={`group relative flex items-start gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-white hover:shadow-md ${
        is_completed ? 'bg-gray-50' : 'bg-white/60'
      }`}
    >
      <button
        onClick={handleCheckboxChange}
        className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-emerald-500"
      >
        {is_completed ? (
          <CheckCircle2 size={20} className="text-emerald-500" />
        ) : (
          <Circle size={20} className={isPastDue ? "text-red-500" : ""} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-sm font-medium ${
              is_completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {title}
          </h3>

          <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowActions(!showActions)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Task options"
            >
              <MoreVerticalIcon size={16} />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200">
                <button
                  onClick={() => {
                    onDelete(id);
                    setShowActions(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2Icon size={14} />
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>

        {description && (
          <p className={`mt-1 text-xs ${is_completed ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {due_date && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                isPastDue
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <CalendarIcon size={12} />
              {format(new Date(due_date), 'MMM d, yyyy')}
            </span>
          )}

          {priority > 0 && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                priorityBadges[priority as keyof typeof priorityBadges].color
              }`}
            >
              <FlagIcon size={12} />
              {priorityBadges[priority as keyof typeof priorityBadges].label}
            </span>
          )}

          {projectName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
              <FolderIcon size={12} />
              {projectName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}