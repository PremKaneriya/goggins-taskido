'use client';

import React, { useState, useEffect } from 'react';
import {
  MenuIcon,
  XIcon,
  InboxIcon,
  CalendarIcon,
  FolderIcon,
  ClipboardList,
  ListChecks,
  Settings,
  UserIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  projects?: { id: number; name: string; status: string }[];
  onSelectProject?: (projectId?: number) => void;
}

export default function Sidebar({ projects = [], onSelectProject }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isTasksDropdownOpen, setIsTasksDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(mobile ? false : true);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    getUsername();
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  const getUsername = async () => {
    try {
      const response = await fetch('/api/username', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch username');
      }
      const data = await response.json();
      setUsername(data.username);
    } catch (err) {
      console.error('Error fetching username:', err);
    }
  };

  const menuItems = [
    { label: 'Inbox', icon: <InboxIcon size={18} />, path: '/tasks' },
    { label: 'Today', icon: <CalendarIcon size={18} />, path: '/today' },
    { label: 'Upcoming', icon: <ClipboardList size={18} />, path: '/upcoming' },
    { label: 'Completed', icon: <ListChecks size={18} />, path: '/completed' },
    { label: 'Missed', icon: <XIcon size={18} />, path: '/missed-tasks' },
  ];

  return (
    <div className="h-screen flex">
      <div className="w-0 md:w-64 flex-shrink-0" />

      <button
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white shadow-lg transition-transform hover:scale-105 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-50 to-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isMobile && isOpen ? 'overflow-hidden' : ''}`}
      >
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 truncate">
            {username ? `${username}'s Taskido` : 'Taskido'}
          </h1>
        </div>

        <nav className="flex flex-col p-3 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200">
          <div>
            <button
              className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsTasksDropdownOpen(!isTasksDropdownOpen)}
              aria-expanded={isTasksDropdownOpen}
              aria-controls="tasks-dropdown"
            >
              <div className="flex items-center gap-2">
                <ClipboardList size={18} />
                <span className="font-medium text-sm">Tasks</span>
              </div>
              <ChevronDownIcon
                size={16}
                className={`transition-transform ${isTasksDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isTasksDropdownOpen && (
              <div id="tasks-dropdown" className="ml-4 mt-1 space-y-1">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.path}
                    onClick={() => isMobile && setIsOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm text-sm"
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsProjectsDropdownOpen(!isProjectsDropdownOpen)}
              aria-expanded={isProjectsDropdownOpen}
              aria-controls="projects-dropdown"
            >
              <div className="flex items-center gap-2">
                <FolderIcon size={18} />
                <span className="font-medium text-sm">Projects</span>
              </div>
              <ChevronDownIcon
                size={16}
                className={`transition-transform ${isProjectsDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isProjectsDropdownOpen && (
              <div id="projects-dropdown" className="ml-4 mt-1 space-y-1">
                <Link
                  href="/new-project"
                  onClick={() => isMobile && setIsOpen(false)}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm text-sm"
                >
                  <FolderIcon size={18} />
                  <span className="font-medium">On-going Projects</span>
                </Link>
                <Link
                  href="/completed-projects"
                  onClick={() => {
                    if (isMobile) setIsOpen(false);
                    setIsProjectsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm text-sm"
                >
                  <FolderIcon size={18} />
                  <span className="font-medium">Completed Projects</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 text-sm mb-1"
          >
            <UserIcon size={18} />
            <span className="font-medium">Profile</span>
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 text-sm"
          >
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
