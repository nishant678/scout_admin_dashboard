import { api } from '../lib';

export interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  section: string;
  unit: string;
  county: string;
  status: string;
  submissionDate: string;
  notes: string;
  createdAt: string;
}

export const getRegistrations = (page = 0, size = 10, status?: string) =>
  api.get<{ data: { content: Registration[]; page: number; size: number; totalElements: number; totalPages: number; last: boolean } }>('/registrations', { params: { page, size, status } }).then(r => r.data.data);

export const getRegistration = (id: number) =>
  api.get<{ data: Registration }>(`/registrations/${id}`).then(r => r.data.data);

export const createRegistration = (data: { name: string; email: string; phone?: string; section: string; unit: string; county: string; notes?: string }) =>
  api.post<{ data: Registration }>('/registrations', data).then(r => r.data.data);

export const updateRegistration = (id: number, data: Partial<Registration>) =>
  api.put<{ data: Registration }>(`/registrations/${id}`, data).then(r => r.data.data);

export const deleteRegistration = (id: number) =>
  api.delete<{ data: void }>(`/registrations/${id}`).then(r => r.data.data);
