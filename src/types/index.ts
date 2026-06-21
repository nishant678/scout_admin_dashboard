// Dashboard Types
export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: string;
  bgColor: string;
  textColor: string;
}

// Member Types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  section: 'Beavers' | 'Cubs' | 'Scouts' | 'Ventures' | 'Rovers';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  county: string;
  unit: string;
  avatar?: string;
}

// Registration Types
export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  section: string;
  unit: string;
  county: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  age: number;
}

// Approval Types
export interface Approval {
  id: string;
  type: 'member' | 'event' | 'budget';
  title: string;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
}

// Finance Types
export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
  reference: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  balance: number;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  fill: string;
}

// Unit Type
export interface Unit {
  id: string;
  name: string;
  code: string;
  county: string;
  members: number;
  status: 'active' | 'inactive';
}

// County Type
export interface County {
  id: string;
  name: string;
  code: string;
  units: number;
  members: number;
  coordinates: [number, number]; // [lat, lng]
}

// Audit Log Types
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, unknown>;
  status: 'success' | 'failure';
}

// User Types
export type UserRole = 'ADMIN' | 'LEADER' | 'USER';

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterState {
  searchTerm: string;
  status?: string;
  category?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}
