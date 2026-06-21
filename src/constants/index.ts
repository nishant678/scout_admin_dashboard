// Navigation items with role-based access
export const NAVIGATION_ITEMS: {
  id: string; label: string; icon: string; path: string; badge?: number; roles?: string[];
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', path: '/dashboard', roles: ['ADMIN', 'LEADER'] },
  { id: 'users', label: 'Users', icon: 'Users', path: '/users', roles: ['ADMIN', 'LEADER'] },
  { id: 'registrations', label: 'Registrations', icon: 'ClipboardList', path: '/registrations', roles: ['ADMIN', 'LEADER'] },
  { id: 'sections', label: 'Sections', icon: 'Layers', path: '/sections', roles: ['ADMIN', 'LEADER'] },
  { id: 'counties', label: 'Counties', icon: 'Map', path: '/counties', roles: ['ADMIN', 'LEADER'] },
  { id: 'approvals', label: 'Approvals', icon: 'CheckCircle', path: '/approvals', badge: 12, roles: ['ADMIN', 'LEADER'] },
  { id: 'members', label: 'Members', icon: 'Users', path: '/members', roles: ['ADMIN', 'LEADER'] },
  { id: 'units', label: 'Units & Locations', icon: 'MapPin', path: '/units', roles: ['ADMIN', 'LEADER'] },
  { id: 'finance', label: 'Finance', icon: 'DollarSign', path: '/finance', roles: ['ADMIN'] },
  { id: 'reports', label: 'Reports', icon: 'FileText', path: '/reports', roles: ['ADMIN', 'LEADER'] },
  { id: 'audit', label: 'Audit Logs', icon: 'Shield', path: '/audit', roles: ['ADMIN'] },
  { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings', roles: ['ADMIN', 'LEADER', 'USER'] },
];

// Section types
export const SECTION_TYPES = ['Beavers', 'Cubs', 'Scouts', 'Ventures', 'Rovers'];

// Status colors
export const STATUS_COLORS = {
  active: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-200' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-800', badge: 'bg-gray-200' },
  suspended: { bg: 'bg-red-100', text: 'text-red-800', badge: 'bg-red-200' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', badge: 'bg-yellow-200' },
  approved: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-200' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', badge: 'bg-red-200' },
  completed: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-200' },
};

// Priority colors
export const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

// Kenya Counties
export const KENYA_COUNTIES = [
  { name: 'Nairobi', code: 'NRB' },
  { name: 'Mombasa', code: 'MBA' },
  { name: 'Kisumu', code: 'KSM' },
  { name: 'Nakuru', code: 'NKU' },
  { name: 'Uasin Gishu', code: 'UGI' },
];

// Colors for charts
export const CHART_COLORS = {
  primary: '#22c55e',
  secondary: '#3b82f6',
  tertiary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
};

// Date formats
export const DATE_FORMATS = {
  short: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  full: 'EEEE, MMMM d, yyyy',
  time: 'HH:mm',
  datetime: 'MMM d, yyyy HH:mm',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
