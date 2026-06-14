import { api } from '../lib';

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ReportSummary {
  totalMembers: number;
  newRegistrations: number;
  pendingApprovals: number;
  totalRevenue: number;
  activeCounties: number;
  totalCounties: number;
  totalRevenueChange: number;
}

export const getRegistrationTrends = (period = '30d') =>
  api.get<{ data: ChartPoint[] }>('/reports/registration-trends', { params: { period } }).then(r => r.data.data);

export const getMembershipBySection = (type = 'current') =>
  api.get<{ data: ChartPoint[] }>('/reports/membership-by-section', { params: { type } }).then(r => r.data.data);

export const getReportsSummary = (period = '30d') =>
  api.get<{ data: ReportSummary }>('/reports/summary', { params: { period } }).then(r => r.data.data);

export const getCountyBreakdown = () =>
  api.get<{ data: ChartPoint[] }>('/reports/county-breakdown').then(r => r.data.data);
