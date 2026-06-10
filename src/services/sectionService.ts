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

export const getCounties = () =>
  api.get<{ data: County[] }>('/counties').then(r => r.data.data);
