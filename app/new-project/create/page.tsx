// FILE: /app/projects/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Task = {
  id: string;
  title: string;
};

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setMessage('Please enter a project title');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          tasks_ids: selectedTasks,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Project created successfully!');
        setMessageType('success');
        // Navigate back to projects list after successful creation
        setTimeout(() => {
          router.push('/new-project'); 
        }, 1500);
      } else {
        setMessage(data.message || 'Something went wrong');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Failed to connect to server');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="max-w-2xl mx-auto my-12 text-gray-800 p-8 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Project</h1>
        <Link 
          href="/new-project" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Back to Projects
        </Link>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter project title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Describe your project"
            className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Associated Tasks
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {tasks.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                      selectedTasks.includes(task.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectTask(task.id)}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                      selectedTasks.includes(task.id) 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedTasks.includes(task.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700">{task.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No tasks available
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            onClick={() => {
              setTitle('');
              setDescription('');
              setSelectedTasks([]);
              setMessage('');
            }}
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin mr-2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                Create Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}