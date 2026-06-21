import { api } from '../lib';

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const getUsers = () =>
  api.get<{ data: User[] }>('/users').then(r => r.data.data);

export const getUser = (id: number) =>
  api.get<{ data: User }>(`/users/${id}`).then(r => r.data.data);

export const createUser = (data: { name: string; email: string; phone?: string; role: string }) =>
  api.post<{ data: any }>('/users', data).then(r => r.data.data);

export const toggleUserStatus = (id: number) =>
  api.patch<{ data: User }>(`/users/${id}/toggle-status`).then(r => r.data.data);

export const deleteUser = (id: number) =>
  api.delete<{ data: void }>(`/users/${id}`).then(r => r.data.data);
