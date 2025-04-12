import React, { useState } from 'react';
import { MenuIcon, XIcon, InboxIcon, CalendarIcon, FolderIcon } from 'lucide-react';

interface SidebarProps {
  projects?: { id: number; name: string }[];
  onSelectProject?: (projectId?: number) => void;
}

export default function Sidebar({ projects = [], onSelectProject }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-3 left-3 z-50 text-gray-600 sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-52 bg-white transform transition-transform duration-200 sm:static sm:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        }`}
      >
        <div className="p-3">
          <h1 className="text-base font-bold text-[#db4c3f]">Taskido</h1>
        </div>

        <nav className="space-y-0.5 px-3">
          <button
            onClick={() => onSelectProject?.(undefined)}
            className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
          >
            <InboxIcon size={14} />
            Inbox
          </button>
          <button
            onClick={() => onSelectProject?.(undefined)}
            className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
          >
            <CalendarIcon size={14} />
            Today
          </button>
        </nav>

        <div className="mt-3 px-3">
          <h2 className="mb-1 px-2 text-xs font-medium text-gray-500">Projects</h2>
          <div className="space-y-0.5">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelectProject?.(project.id)}
                className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-[#db4c3f]/10 hover:text-[#db4c3f]"
              >
                <FolderIcon size={14} />
                {project.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}