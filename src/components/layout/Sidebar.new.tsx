import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../utils';
import { NAVIGATION_ITEMS } from '../../constants';
import { useSidebarStore } from '../../store';

const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const location = useLocation();

  const isItemActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary-700 text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary-800 to-primary-900',
          'shadow-2xl overflow-y-auto z-40 transition-transform duration-300',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-primary-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-300 flex items-center justify-center">
              <span className="text-primary-900 font-bold text-lg">KS</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Kenya Scouts</h2>
              <p className="text-primary-200 text-xs">Administration</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-primary-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">Super Admin</p>
              <p className="text-primary-200 text-xs truncate">admin@scout.co.ke</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = isItemActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 relative hover:translate-x-1',
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-primary-100 hover:bg-primary-700/50'
                )}
              >
                <span className="text-lg">{getIconComponent(item.icon)}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-300 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

// Helper function to get icon component
const getIconComponent = (iconName: string): string => {
  const icons: Record<string, string> = {
    BarChart3: '📊',
    ClipboardList: '📋',
    CheckCircle: '✓',
    Users: '👥',
    MapPin: '📍',
    DollarSign: '💰',
    FileText: '📄',
    Shield: '🛡️',
    Settings: '⚙️',
  };
  return icons[iconName] || '•';
};

export default Sidebar;
