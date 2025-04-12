import { Task } from '@/lib/db/tasks';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FlagIcon, Trash2Icon, MoreVerticalIcon, FolderIcon } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onComplete: (id: number, isCompleted: boolean) => void;
  onDelete: (id: number) => void;
  projectName?: string;
}

export default function TaskItem({ task, onComplete, onDelete, projectName }: TaskItemProps) {
  const { id, title, description, due_date, priority, is_completed } = task;
  const [showActions, setShowActions] = useState(false);

  const priorityStyles = {
    0: 'text-gray-400',
    1: 'text-blue-500',
    2: 'text-orange-500',
    3: 'text-[#db4c3f]',
  };

  const handleCheckboxChange = () => {
    onComplete(id, !is_completed);
  };

  return (
    <div
      className={`flex items-center gap-2 rounded p-2 transition-all duration-200 hover:bg-[#fafafa] ${
        is_completed ? 'opacity-60' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={is_completed}
        onChange={handleCheckboxChange}
        className="h-4 w-4 rounded border-gray-300 text-[#db4c3f] focus:ring-[#db4c3f]/30"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3
            className={`text-sm ${is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
          >
            {title}
          </h3>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <MoreVerticalIcon size={14} />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-24 rounded bg-white shadow-md ring-1 ring-gray-200 z-10">
                <button
                  onClick={() => {
                    onDelete(id);
                    setShowActions(false);
                  }}
                  className="flex w-full items-center gap-1 px-2 py-1 text-xs text-[#db4c3f] hover:bg-[#db4c3f]/10"
                >
                  <Trash2Icon size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {description && (
          <p className={`mt-0.5 text-xs text-gray-500 ${is_completed ? 'text-gray-400' : ''}`}>
            {description}
          </p>
        )}

        <div className="mt-1 flex flex-wrap gap-2">
          {due_date && (
            <span
              className={`flex items-center gap-1 text-xs ${
                new Date(due_date) < new Date() && !is_completed ? 'text-[#db4c3f]' : 'text-gray-500'
              }`}
            >
              <CalendarIcon size={10} />
              {format(new Date(due_date), 'MMM d')}
            </span>
          )}

          {priority > 0 && (
            <span className={`flex items-center gap-1 text-xs ${priorityStyles[priority as keyof typeof priorityStyles]}`}>
              <FlagIcon size={10} />
              {['Low', 'Medium', 'High', 'Urgent'][priority]}
            </span>
          )}

          {projectName && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FolderIcon size={10} />
              {projectName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}