// components/tasks/TaskList.tsx
import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { Task } from '@/lib/db/tasks';
import { ChevronDownIcon, ChevronUpIcon, ListFilterIcon, CheckIcon, ClockIcon, CalendarIcon, FlagIcon, FileDown } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onCompleteTask: (id: number, isCompleted: boolean) => void;
  onDeleteTask: (id: number) => void;
  projects?: { id: number; name: string }[];
}

export default function TaskList({ 
  tasks, 
  isLoading, 
  error, 
  onCompleteTask, 
  onDeleteTask,
  projects = []
}: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true);
      
      // Trigger PDF download
      window.location.href = '/api/tasks/pdf';
      
      // Set timeout to reset loading state
      setTimeout(() => {
        setPdfLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setPdfLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="animate-pulse rounded-full h-12 w-12 border-4 border-gray-700 mb-4"></div>
          <p className="text-gray-800 font-bold uppercase">GET READY TO GRIND...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/10 border border-red-800 rounded-lg text-red-600 flex items-center justify-center">
        <span className="font-bold uppercase">MISSION FAILED: {error}</span>
      </div>
    );
  }

  const getProjectName = (projectId?: number) => {
    if (!projectId) return undefined;
    const project = projects.find(p => p.id === projectId);
    return project?.name;
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.is_completed;
    if (filter === 'completed') return task.is_completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return b.priority - a.priority;
  });

  if (tasks.length === 0) {
    return (
      <div className="p-8 bg-gray-900/5 border-2 border-dashed border-gray-700 rounded-lg text-center">
        <p className="text-gray-800 text-xl font-bold uppercase">No tasks? Who's gonna carry the boats?</p>
        <p className="text-gray-600 mt-2">GET AFTER IT. ADD A TASK NOW.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="font-bold text-gray-800 uppercase tracking-wide">
          {filteredTasks.length} MISSION{filteredTasks.length !== 1 ? 'S' : ''} AWAITING
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPdf}
            disabled={pdfLoading || tasks.length === 0}
            className="flex items-center gap-2 text-white p-2 rounded-md bg-gray-800 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:hover:bg-gray-800"
          >
            {pdfLoading ? (
              <>
                <svg className="animate-spin mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                GENERATING...
              </>
            ) : (
              <>
                <FileDown size={18} />
                <span className="font-medium">DOWNLOAD PDF</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ListFilterIcon size={18} />
            <span className="font-medium">CONTROL YOUR BATTLEFIELD</span>
            {showFilters ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-800/5 p-4 rounded-lg border-2 border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 uppercase mb-2">Filter Your Fight</label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All', icon: null },
                  { value: 'active', label: 'Active', icon: ClockIcon },
                  { value: 'completed', label: 'Conquered', icon: CheckIcon }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value as any)}
                    className={`px-4 py-2 rounded-md font-medium uppercase text-sm tracking-wide flex items-center gap-2 ${
                      filter === value 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {Icon && <Icon size={14} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-800 uppercase mb-2">Sort Your Grind</label>
              <div className="flex gap-2">
                {[
                  { value: 'date', label: 'Deadline', icon: CalendarIcon },
                  { value: 'priority', label: 'Priority', icon: FlagIcon }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSortBy(value as any)}
                    className={`px-4 py-2 rounded-md font-medium uppercase text-sm tracking-wide flex items-center gap-2 ${
                      sortBy === value 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {sortedTasks.map(task => (
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