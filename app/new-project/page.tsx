
// File structure:
// /app
//   /projects
//     /page.tsx (Projects list page)
//     /create
//       /page.tsx (Create project page)

// FILE: /app/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/projects');
        
        if (!res.ok) {
          if (res.status === 404) {
            // No projects is not an error state, just empty
            setProjects([]);
            return;
          }
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Unable to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="max-w-6xl text-gray-800 mx-auto my-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        <Link 
          href="/new-project/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
        >
          <Plus size={18} className="mr-2" />
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={40} className="animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Create your first project to get started</p>
          <Link 
            href="/projects/create" 
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
          >
            <Plus size={18} className="mr-2" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{project.title}</h2>
                <p className="text-gray-600 mb-5 line-clamp-2 h-12">
                  {project.description || "No description provided"}
                </p>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Clock size={16} className="mr-1.5" />
                  <span>Created {formatDate(project.created_at)}</span>
                </div>

                {project.status && (
                  <div className="mb-4">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status === 'in-progress' ? 'In Progress' : 
                       project.status === 'completed' ? 'Completed' : 'Not Started'}
                    </span>
                  </div>
                )}
                
                <Link 
                  href={`/projects/${project.id}`} 
                  className="mt-2 flex items-center font-medium text-blue-600 hover:text-blue-800"
                >
                  View details
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
