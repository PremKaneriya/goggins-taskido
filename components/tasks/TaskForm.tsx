// components/tasks/TaskForm.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FlagIcon, FolderIcon, CheckCircle2 } from 'lucide-react';

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
      project_id: projectId
    });
    
    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority(0);
    setProjectId(undefined);
  };

  return (
    <div className="max-w-2xl mx-auto text-gray-700">
      
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl border-2 border-gray-800 shadow-lg">
        <div>
          <input
            type="text"
            placeholder="NAME YOUR MISSION"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-gray-900 focus:outline-none text-lg font-bold uppercase tracking-wide placeholder-gray-400 transition-colors bg-transparent"
            required
          />
        </div>
        
        <div>
          <textarea
            placeholder="MISSION BRIEFING (OPTIONAL)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-transparent placeholder-gray-400"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center text-sm font-bold text-gray-800 uppercase mb-2 gap-2">
              <CalendarIcon size={16} />
              Deadline
            </label>
            <input
              type="date"
              value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full p-2 border-2 border-gray-700 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
            />
          </div>
          
          <div>
            <label className="flex items-center text-sm font-bold text-gray-800 uppercase mb-2 gap-2">
              <FlagIcon size={16} />
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full p-2 border-2 border-gray-700 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-transparent uppercase font-medium"
            >
              <option value={0}>NO EXCUSES</option>
              <option value={1}>DO IT ANYWAY</option>
              <option value={2}>GET AFTER IT</option>
              <option value={3}>URGENT</option>
            </select>
          </div>
          
          {projects.length > 0 && (
            <div>
              <label className="flex items-center text-sm font-bold text-gray-800 uppercase mb-2 gap-2">
                <FolderIcon size={16} />
                Unit
              </label>
              <select
                value={projectId || ''}
                onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2 border-2 border-gray-700 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-transparent uppercase font-medium"
              >
                <option value="">NO UNIT</option>
                {projects.map(project => (
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
          className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 focus:outline-none disabled:opacity-50 transition-colors font-bold uppercase tracking-widest flex items-center justify-center shadow-md"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              LOCKING IN...
            </>
          ) : (
            <>
              <CheckCircle2 size={20} className="mr-2" />
              DEPLOY MISSION
            </>
          )}
        </button>
      </form>
    </div>
  );
}