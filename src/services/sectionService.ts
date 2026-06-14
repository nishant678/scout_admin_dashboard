import { api } from '../lib';

export interface Section {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface County {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export const getSections = () =>
  api.get<{ data: Section[] }>('/sections').then(r => r.data.data);

export const getSection = (id: number) =>
  api.get<{ data: Section }>(`/sections/${id}`).then(r => r.data.data);

export const createSection = (data: { name: string; description?: string }) =>
  api.post<{ data: Section }>('/sections', data).then(r => r.data.data);

export const updateSection = (id: number, data: { name: string; description?: string }) =>
  api.put<{ data: Section }>(`/sections/${id}`, data).then(r => r.data.data);

export const deleteSection = (id: number) =>
  api.delete(`/sections/${id}`).then(r => r.data);

export const getCounties = () =>
  api.get<{ data: County[] }>('/counties').then(r => r.data.data);
