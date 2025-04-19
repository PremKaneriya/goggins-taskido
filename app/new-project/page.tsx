"use client";

import React, { useState, useEffect } from "react";
import { Clock, Plus } from "lucide-react";
import Sidebar from "@/components/tasks/SideBar";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: 'in-progress' | 'completed' | 'not-started' | 'dismissed';
}

interface Task {
  id: string;
  title: string;
}

export default function NewProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects", {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        if (response.status === 404) {
          setProjects([]);
          return;
        }
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks", {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Please enter a project title");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tasks_ids: selectedTasks,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Project created successfully!");
        setMessageType("success");
        setTitle("");
        setDescription("");
        setSelectedTasks([]);
        setTimeout(() => {
          setIsModalOpen(false);
          fetchProjects(); // Refresh project list
          setMessage("");
        }, 1500);
      } else {
        setMessage(data.message || "Something went wrong");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Failed to connect to server");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl w-full">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              My Projects
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center transition text-sm sm:text-base"
            >
              <Plus size={18} className="mr-2" />
              New Project
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">
                Loading projects...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-red-500 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                Error: {error}
              </div>
              <button
                onClick={fetchProjects}
                className="w-full py-2 sm:py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                No projects available.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Clock
                        size={20}
                        className="text-indigo-500 sm:mt-1 shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500">
                          <Clock size={14} className="sm:size-16" />
                          <span>Created: {formatDate(project.created_at)}</span>
                        </div>
                        {project.status && (
                          <span
                            className={
                              project.status === "completed"
                                ? "inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                                : project.status === "in-progress"
                                ? "inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                                : "inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"  
                            } 
                          >
                            {project.status === "in-progress" ? "In Progress" : project.status === "completed" ? "Completed" : "Not Started"}
                          </span>
                        )}
                        <Link
                          href={`/new-project/${project.id}`}
                          className="mt-2 flex items-center text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium transition-colors"
                        >
                          View details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1.5"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal for Creating New Project */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-900">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Create New Project
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18"></path>
                      <path d="M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="modal-title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Project Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="modal-title"
                      type="text"
                      placeholder="Enter project title"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="modal-description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="modal-description"
                      placeholder="Describe your project"
                      className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Associated Tasks
                    </label>
                    <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                              selectedTasks.includes(task.id)
                                ? "bg-indigo-50"
                                : ""
                            }`}
                            onClick={() => handleSelectTask(task.id)}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 mr-3 transition-all ${
                                selectedTasks.includes(task.id)
                                  ? "border-indigo-600 bg-indigo-600"
                                  : "border-gray-400"
                              }`}
                            >
                              {selectedTasks.includes(task.id) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-700 text-sm">
                              {task.title}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500">
                          No tasks available
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {selectedTasks.length} task
                      {selectedTasks.length !== 1 ? "s" : ""} selected
                    </div>
                  </div>
                  {message && (
                    <div
                      className={`p-3 rounded-lg ${
                        messageType === "success"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setIsModalOpen(false);
                        setTitle("");
                        setDescription("");
                        setSelectedTasks([]);
                        setMessage("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-80"
                    >
                      {loading ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-spin mr-2 inline"
                          >
                            <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        "Create Project"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}