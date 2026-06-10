import { api } from '../lib';

export interface DashboardMetrics {
  totalMembers: { current: number; change: number; trend: string };
  pendingApprovals: { current: number; change: number; trend: string };
  totalUnits: { current: number; change: number; trend: string };
  totalRevenue: { current: number; change: number; trend: string };
  activeCounties: { current: number; total: number };
  newRegistrations: number;
  registrationsOverview: { label: string; value: number }[];
  membersBySection: { label: string; value: number }[];
  revenueBreakdown: { label: string; value: number }[];
}

export const getDashboardMetrics = () =>
  api.get<{ data: DashboardMetrics }>('/dashboard/metrics').then(r => r.data.data);
