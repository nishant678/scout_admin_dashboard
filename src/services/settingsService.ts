import { api } from '../lib';

export interface Profile {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface NotificationPrefs {
  email: boolean;
  sms: boolean;
  security: boolean;
}

export interface RegionalSettings {
  timezone: string;
  currency: string;
  dateFormat: string;
}

export const getProfile = () =>
  api.get<{ data: Profile }>('/settings/profile').then(r => r.data.data);

export const updateProfile = (data: Partial<Profile>) =>
  api.patch<{ data: Profile }>('/settings/profile', data).then(r => r.data.data);

export const getNotifications = () =>
  api.get<{ data: NotificationPrefs }>('/settings/notifications').then(r => r.data.data);

export const updateNotifications = (data: Partial<NotificationPrefs>) =>
  api.patch<{ data: NotificationPrefs }>('/settings/notifications', data).then(r => r.data.data);

export const changePassword = (currentPassword: string, newPassword: string) =>
  api.put('/settings/security/password', { currentPassword, newPassword }).then(r => r.data);

export const getRegionalSettings = () =>
  api.get<{ data: RegionalSettings }>('/settings/regional').then(r => r.data.data);

export const updateRegionalSettings = (data: Partial<RegionalSettings>) =>
  api.patch<{ data: RegionalSettings }>('/settings/regional', data).then(r => r.data.data);

export const purgeAuditLogs = () =>
  api.post('/settings/purge-audit-logs').then(r => r.data);

export const resetCache = () =>
  api.post('/settings/reset-cache').then(r => r.data);
