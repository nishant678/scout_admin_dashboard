import { api } from '../lib';

export interface Unit {
  id: number;
  name: string;
  code: string;
  county: string;
  coordinator: string;
  address: string;
  active: boolean;
  createdAt: string;
}

export interface UnitStats {
  totalUnits: number;
  totalCounties: number;
  averageUnitSize: number;
  topCounties: { name: string; units: number; members: number }[];
}

export const getUnits = (page = 0, size = 10) =>
  api.get<{ data: { content: Unit[]; page: number; size: number; totalElements: number; totalPages: number; last: boolean } }>('/units', { params: { page, size } }).then(r => r.data.data);

export const getUnit = (id: number) =>
  api.get<{ data: Unit }>(`/units/${id}`).then(r => r.data.data);

export const createUnit = (data: { name: string; code: string; county: string; coordinator?: string; address?: string }) =>
  api.post<{ data: Unit }>('/units', data).then(r => r.data.data);

export const updateUnit = (id: number, data: Partial<Unit>) =>
  api.put<{ data: Unit }>(`/units/${id}`, data).then(r => r.data.data);

export const deleteUnit = (id: number) =>
  api.delete<{ data: void }>(`/units/${id}`).then(r => r.data.data);

export const getUnitStats = () =>
  api.get<{ data: UnitStats }>('/units/stats').then(r => r.data.data);
