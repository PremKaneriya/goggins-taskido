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
  ChevronDownIcon
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
  const router = useRouter();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(true);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const menuItems = [
    { label: 'Inbox', icon: <InboxIcon size={20} />, path: '/tasks' },
    { label: 'Today', icon: <CalendarIcon size={20} />, path: '/today' },
    { label: 'Upcoming', icon: <ClipboardList size={20} />, path: '/upcoming' },
    { label: 'Completed', icon: <ListChecks size={20} />, path: '/completed' },
    { label: 'Missed', icon: <XIcon size={20} />, path: '/missed-tasks' },
  ];

  return (
    <div className="h-screen flex">
      {/* Sidebar (static placeholder to reserve space) */}
      <div className="w-0 sm:w-72 flex-shrink-0" />
      
      {/* Mobile Menu Toggle */}
      <button
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white transition-transform hover:scale-105 sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Fixed Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-gray-50 to-white transition-transform duration-300 flex flex-col h-screen overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Taskido
          </h1>
        </div>

        <nav className="flex flex-col p-4 space-y-1 flex-shrink-0">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.path}
              onClick={() => isMobile && setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Projects Section */}
        <div className="px-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 flex-1">
            {/* Projects Dropdown */}
            <div>
              <button
                className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => setIsProjectsDropdownOpen(!isProjectsDropdownOpen)}
              >
                <div className="flex items-center gap-3">
                  <FolderIcon size={18} />
                  <span className="font-medium">Projects</span>
                </div>
                <ChevronDownIcon size={18} className={`transition-transform ${isProjectsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProjectsDropdownOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <Link
                    href="/new-project"
                    onClick={() => isMobile && setIsOpen(false)}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
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
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
                  >
                    <FolderIcon size={18} />
                    <span className="font-medium">Completed Projects</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User and Settings */}
        <div className="w-full p-4 border-t border-gray-100 flex-shrink-0">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 mb-2"
          >
            <UserIcon size={20} />
            <span className="font-medium">Profile</span>
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}