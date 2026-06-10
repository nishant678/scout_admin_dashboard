import { api } from '../lib';

export interface Profile {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export const getProfile = () =>
  api.get<{ data: Profile }>('/settings/profile').then(r => r.data.data);

export const updateProfile = (data: Partial<Profile>) =>
  api.patch<{ data: Profile }>('/settings/profile', data).then(r => r.data.data);

export const purgeAuditLogs = () =>
  api.post('/settings/purge-audit-logs').then(r => r.data);

export const resetCache = () =>
  api.post('/settings/reset-cache').then(r => r.data);
