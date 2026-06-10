import { api } from '../lib';

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  userName: string;
  details: string;
  createdAt: string;
}

export interface AuditStats {
  totalActivities: number;
  successRate: number;
  securityAlerts: number;
}

export const getAuditLogs = (page = 0, size = 10) =>
  api.get<{ data: { content: AuditLog[]; page: number; size: number; totalElements: number; totalPages: number; last: boolean } }>('/audit-logs', { params: { page, size } }).then(r => r.data.data);

export const getAuditStats = () =>
  api.get<{ data: AuditStats }>('/audit-logs/stats').then(r => r.data.data);
