import { api } from '../lib';

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  section: string;
  unit: string;
  county: string;
  status: string;
  dateOfBirth: string | null;
  address: string;
  createdAt: string;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  pendingRenewal: number;
}

export interface PagedResult<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getMembers = (page = 0, size = 10, search?: string) =>
  api.get<{ data: PagedResult<Member> }>('/members', { params: { page, size, search } }).then(r => r.data.data);

export const getMemberStats = () =>
  api.get<{ data: MemberStats }>('/members/stats').then(r => r.data.data);

export const getMember = (id: number) =>
  api.get<{ data: Member }>(`/members/${id}`).then(r => r.data.data);

export const createMember = (data: { firstName: string; lastName: string; email: string; phone?: string; section: string; unit: string; county: string }) =>
  api.post<{ data: Member }>('/members', data).then(r => r.data.data);

export const updateMember = (id: number, data: Partial<Member>) =>
  api.put<{ data: Member }>(`/members/${id}`, data).then(r => r.data.data);

export const deleteMember = (id: number) =>
  api.delete<{ data: void }>(`/members/${id}`).then(r => r.data.data);
