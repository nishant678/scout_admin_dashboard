import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from '../../utils';
import { NAVIGATION_ITEMS } from '../../constants';
import { useSidebarStore } from '../../store';
import { useAuthStore } from '../../store/authStore';
import { getDashboardMetrics } from '../../services/dashboardService';

const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    getDashboardMetrics().then(m => setPendingCount(m.pendingApprovals.current)).catch(() => {});
  }, []);

  const userRole = user?.role || '';
  const visibleItems = NAVIGATION_ITEMS.filter(item => !item.roles || item.roles.includes(userRole));

  const isItemActive = (path: string) => location.pathname === path;

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary-700 text-white p-2 rounded-lg hover:bg-primary-800 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'w-64 h-screen bg-gradient-to-b from-primary-800 to-primary-900',
          'shadow-2xl flex flex-col',
          'fixed left-0 top-0 z-40 transition-transform duration-300 lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-6 border-b border-primary-700 flex-shrink-0">
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

        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {visibleItems.map((item) => {
            const isActive = isItemActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative hover:translate-x-1',
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-primary-100 hover:bg-primary-700/50'
                )}
              >
                <span className="text-lg">{getIconComponent(item.icon)}</span>
                <span className="flex-1">{item.label}</span>
                {(item.id === 'approvals' ? (pendingCount != null && pendingCount > 0) : item.badge != null) && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.id === 'approvals' ? pendingCount : item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-300 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-700">
          <button
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-primary-100 hover:bg-primary-700/50 hover:text-white transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const getIconComponent = (iconName: string): string => {
  const icons: Record<string, string> = {
    BarChart3: '📊',
    Users: '👥',
    ClipboardList: '📋',
    Layers: '📑',
    Map: '🗺️',
    CheckCircle: '✓',
    MapPin: '📍',
    DollarSign: '💰',
    FileText: '📄',
    Shield: '🛡️',
    Settings: '⚙️',
  };
  return icons[iconName] || '•';
};

export default Sidebar;
