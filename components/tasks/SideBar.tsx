import React, { useState, useEffect } from 'react';
import {
  MenuIcon,
  XIcon,
  InboxIcon,
  CalendarIcon,
  FolderIcon,
  ClipboardList,
  ListChecks,
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  projects?: { id: number; name: string }[];
  onSelectProject?: (projectId?: number) => void;
}

export default function Sidebar({ projects = [], onSelectProject }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const menuItems = [
    { 
      label: 'Inbox', 
      icon: <InboxIcon size={18} />, 
      action: () => {
        router.push('/tasks');
        if (isMobile) setIsOpen(false);
      }
    },
    { 
      label: 'Today', 
      icon: <CalendarIcon size={18} />, 
      action: () => {
        router.push('/today');
        if (isMobile) setIsOpen(false);
      }
    },
    { 
      label: 'Upcoming', 
      icon: <ClipboardList size={18} />, 
      action: () => {
        router.push('/upcoming');
        if (isMobile) setIsOpen(false);
      }
    },
    { 
      label: 'Completed', 
      icon: <ListChecks size={18} />, 
      action: () => {
        router.push('/completed');
        if (isMobile) setIsOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full border border-[#db4c3f] bg-white p-3 text-[#db4c3f] shadow-lg sm:hidden hover:bg-[#db4c3f]/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Bottom Sidebar for Mobile */}
      <aside
        className={`fixed bottom-0 left-0 right-0 z-40 max-h-[80vh] transform bg-white shadow-md transition-transform duration-200 sm:hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-[#db4c3f]">Taskido</h1>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Projects Section */}
        <div className="px-4 mt-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-medium text-gray-500">Projects</h2>
            <button
              className="rounded-full p-1 text-gray-500 hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
              onClick={() => router.push('/new-project')}
            >
              <FolderIcon size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onSelectProject?.(project.id);
                  if (isMobile) setIsOpen(false);
                }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
              >
                <FolderIcon size={16} />
                {project.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings link for mobile */}
        <div className="px-4 py-3 border-t">
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>

      {/* Sidebar for Desktop */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-md h-screen">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-[#db4c3f]">Taskido</h1>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-medium text-gray-500">Projects</h2>
            <button
              className="rounded-full p-1 text-gray-500 hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
              onClick={() => router.push('/new-project')}
            >
              <FolderIcon size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelectProject?.(project.id)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
              >
                <FolderIcon size={16} />
                {project.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings link for desktop */}
        <div className="px-4 py-3 mt-auto border-t absolute bottom-0 w-full">
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}