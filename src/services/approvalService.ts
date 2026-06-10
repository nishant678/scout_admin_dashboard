import { api } from '../lib';

export interface Approval {
  id: number;
  registrationId: number;
  approvedBy: string;
  status: string;
  comment: string;
  createdAt: string;
}

export const approveRegistration = (registrationId: number, comment?: string) =>
  api.post<{ data: Approval }>(`/approvals/${registrationId}/approve`, { comment }).then(r => r.data.data);

export const rejectRegistration = (registrationId: number, comment?: string) =>
  api.post<{ data: Approval }>(`/approvals/${registrationId}/reject`, { comment }).then(r => r.data.data);

export const getApprovalHistory = (registrationId: number) =>
  api.get<{ data: Approval[] }>(`/approvals/${registrationId}/history`).then(r => r.data.data);
