import { api } from '../lib';

export interface ChartPoint {
  label: string;
  value: number;
}

export const getRegistrationTrends = (period = '30d') =>
  api.get<{ data: ChartPoint[] }>('/reports/registration-trends', { params: { period } }).then(r => r.data.data);

export const getMembershipBySection = (type = 'current') =>
  api.get<{ data: ChartPoint[] }>('/reports/membership-by-section', { params: { type } }).then(r => r.data.data);
