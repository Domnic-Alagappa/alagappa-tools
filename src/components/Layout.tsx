import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  activeTool: string;
  onToolChange: (toolId: string) => void;
}

interface MenuItem {
  id: string;
  name: string;
  icon: string;
}

export default function Layout({ children, activeTool, onToolChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const menuItems: MenuItem[] = [
    {
      id: "attendance",
      name: "Attendance",
      icon: "📊",
    },
    {
      id: "document",
      name: "Documents",
      icon: "📄",
    },
    {
      id: "image",
      name: "Images",
      icon: "🖼️",
    },
    {
      id: "video",
      name: "Videos",
      icon: "🎬",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">Alagappa Tools</h1>
          )}
          <button
            onClick={(): void => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            type="button"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={(): void => onToolChange(item.id)}
              className={`w-full flex items-center ${
                sidebarOpen ? "justify-start px-4" : "justify-center"
              } py-3 rounded-lg transition-all ${
                activeTool === item.id
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              type="button"
              aria-label={item.name}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen && (
            <div className="text-xs text-gray-500 text-center">
              Version 1.0.0
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}

