'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Menu,
  X,
  Inbox,
  Calendar,
  Folder,
  ClipboardList,
  ListChecks,
  User,
  ChevronDown,
  Home,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  projects?: { id: number; name: string; status: string }[];
  onSelectProject?: (projectId?: number) => void;
}

interface DropdownItemProps {
  label: string;
  icon: React.ReactNode;
  path: string;
  onClick?: () => void;
  active?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, icon, path, onClick, active }) => (
  <Link
    href={path}
    onClick={onClick}
    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-indigo-100 text-sm ${
      active 
        ? 'bg-indigo-100 text-indigo-700 font-medium' 
        : 'text-gray-700 hover:text-indigo-700'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

const DropdownSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isOpen, toggleOpen, children }) => (
  <div className="mb-2">
    <button
      className="w-full flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:bg-indigo-50 text-gray-800"
      onClick={toggleOpen}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      <ChevronDown
        size={16}
        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && (
      <div className="ml-4 mt-1 space-y-1">
        {children}
      </div>
    )}
  </div>
);

export default function Sidebar({ projects = [], onSelectProject }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(true);
  const [isTasksDropdownOpen, setIsTasksDropdownOpen] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Efficiently check if a path is active
  const isActive = useCallback((path: string) => {
    return pathname === path;
  }, [pathname]);

  // Handle window resize
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

  // Fetch username
  useEffect(() => {
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
    
    getUsername();
  }, []);

  // Handle body overflow for mobile view
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  const menuItems = [
    { label: 'Today', icon: <Calendar size={18} />, path: '/today' },
    { label: 'Upcoming', icon: <ClipboardList size={18} />, path: '/upcoming' },
    { label: 'Completed', icon: <CheckCircle2 size={18} />, path: '/completed' },
    { label: 'Missed', icon: <X size={18} />, path: '/missed-tasks' },
  ];

  const closeSidebarOnMobile = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <div className="h-screen flex">
      {/* Spacer that takes up the same width as the sidebar when it's open */}
      <div className="w-0 md:w-64 flex-shrink-0" />

      {/* Mobile toggle button */}
      <button
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white shadow-lg transition-transform hover:scale-105 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transition-transform duration-300 flex flex-col h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isMobile && isOpen ? 'overflow-hidden' : ''}`}
      >
        {/* Header section */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 truncate">
            {username ? `${username}'s Taskido` : 'Taskido'}
          </h1>
          
          <Link
            href="/tasks"
            onClick={closeSidebarOnMobile}
            className={`mt-3 flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all hover:bg-indigo-100 text-sm ${
              isActive('/dashboard') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
            }`}
          >
            <Home size={18} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            href="/profile"
            onClick={closeSidebarOnMobile}
            className={`mt-3 flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all hover:bg-indigo-100 text-sm ${
              isActive('/profile') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
            }`}
          >
            <User size={18} />
            <span className="font-medium">Profile</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-3 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200">
          {/* Tasks dropdown */}
          <DropdownSection
            title="Tasks"
            icon={<ClipboardList size={18} />}
            isOpen={isTasksDropdownOpen}
            toggleOpen={() => setIsTasksDropdownOpen(!isTasksDropdownOpen)}
          >
            {menuItems.map((item, idx) => (
              <DropdownItem
                key={idx}
                label={item.label}
                icon={item.icon}
                path={item.path}
                onClick={closeSidebarOnMobile}
                active={isActive(item.path)}
              />
            ))}
          </DropdownSection>

          {/* Projects dropdown */}
          <DropdownSection
            title="Projects"
            icon={<Folder size={18} />}
            isOpen={isProjectsDropdownOpen}
            toggleOpen={() => setIsProjectsDropdownOpen(!isProjectsDropdownOpen)}
          >
            <DropdownItem
              label="All Projects"
              icon={<PlusCircle size={18} />}
              path="/new-project"
              onClick={closeSidebarOnMobile}
              active={isActive('/projects')}
            />
            <DropdownItem
              label="Completed Projects"
              icon={<CheckCircle2 size={18} />}
              path="/completed-projects"
              onClick={closeSidebarOnMobile}
              active={isActive('/completed-projects')}
            />
          </DropdownSection>
        </nav>
      </aside>

      {/* Overlay for mobile */}
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