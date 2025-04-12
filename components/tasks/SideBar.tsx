import React, { useState } from 'react';
import {
  MenuIcon,
  XIcon,
  InboxIcon,
  CalendarIcon,
  FolderIcon,
} from 'lucide-react';

interface SidebarProps {
  projects?: { id: number; name: string }[];
  onSelectProject?: (projectId?: number) => void;
}

export default function Sidebar({ projects = [], onSelectProject }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Inbox', icon: <InboxIcon size={16} />, action: () => onSelectProject?.(undefined) },
    { label: 'Today', icon: <CalendarIcon size={16} />, action: () => onSelectProject?.(undefined) },
  ];

  return (
    <>
      {/* Mobile Menu Toggle - Bottom Right + Styled */}
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
          <h2 className="text-xs font-medium text-gray-500 mb-2">Projects</h2>
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
      </aside>

      {/* Sidebar for Desktop */}
      <aside className="hidden sm:block sm:w-64 bg-white shadow-md">
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
          <h2 className="text-xs font-medium text-gray-500 mb-2">Projects</h2>
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
