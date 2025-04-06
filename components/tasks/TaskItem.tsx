// components/tasks/TaskItem.tsx
import { Task } from '@/lib/db/tasks';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FlagIcon, Trash2Icon, FolderIcon, MoreVerticalIcon, CheckIcon } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onComplete: (id: number, isCompleted: boolean) => void;
  onDelete: (id: number) => void;
  projectName?: string;
}

export default function TaskItem({ task, onComplete, onDelete, projectName }: TaskItemProps) {
  const { id, title, description, due_date, priority, is_completed, project_id } = task;
  const [showActions, setShowActions] = useState(false);
  
  const priorityStyles = {
    0: 'bg-gray-200 text-gray-800',
    1: 'bg-blue-900/20 text-blue-900',
    2: 'bg-yellow-900/20 text-yellow-900',
    3: 'bg-red-900/20 text-red-900'
  };
  
  const priorityLabels = {
    0: 'NO EXCUSES',
    1: 'DO IT ANYWAY',
    2: 'GET AFTER IT',
    3: 'URGENT'
  };

  const handleCheckboxChange = () => {
    onComplete(id, !is_completed);
  };

  return (
    <div 
      className={`p-4 rounded-lg border-2 ${
        is_completed 
          ? 'bg-gray-100 border-gray-300 opacity-75' 
          : 'bg-white border-gray-800 hover:border-gray-600'
      } transition-all duration-200 relative group`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleCheckboxChange}
          className={`mt-1 h-6 w-6 rounded-md border-2 flex items-center justify-center ${
            is_completed 
              ? 'bg-gray-800 border-gray-800 text-white' 
              : 'border-gray-700 hover:border-gray-900'
          }`}
        >
          {is_completed && <CheckIcon size={14} />}
        </button>
        
        <div className="flex-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className={`font-bold text-lg tracking-wide uppercase ${
              is_completed ? 'line-through text-gray-600' : 'text-gray-900'
            }`}>
              {title}
            </h3>
            
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-200"
              >
                <MoreVerticalIcon size={18} />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-md border-2 border-gray-700 z-10 w-40">
                  <button
                    onClick={() => {
                      onDelete(id);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-900 hover:bg-red-900/10 flex items-center gap-2 font-bold uppercase"
                  >
                    <Trash2Icon size={16} />
                    Drop It
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {description && (
            <p className={`text-sm mt-2 ${is_completed ? 'text-gray-500' : 'text-gray-700'}`}>
              {description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            {due_date && (
              <span className={`text-xs px-3 py-1 rounded-full border-2 font-medium uppercase tracking-wide flex items-center gap-2
                ${new Date(due_date) < new Date() && !is_completed 
                  ? 'bg-red-900/20 text-red-900 border-red-900/50' 
                  : 'bg-gray-200 text-gray-800 border-gray-400'}`}
              >
                <CalendarIcon size={14} />
                {format(new Date(due_date), 'MMM d, yyyy')}
              </span>
            )}
            
            {priority > 0 && (
              <span className={`text-xs ${priorityStyles[priority as keyof typeof priorityStyles]} px-3 py-1 rounded-full border-2 font-medium uppercase tracking-wide flex items-center gap-2`}>
                <FlagIcon size={14} />
                {priorityLabels[priority as keyof typeof priorityLabels]}
              </span>
            )}
            
            {projectName && (
              <span className="text-xs bg-gray-800/10 text-gray-800 border-2 border-gray-400 px-3 py-1 rounded-full font-medium uppercase tracking-wide flex items-center gap-2">
                <FolderIcon size={14} />
                {projectName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}