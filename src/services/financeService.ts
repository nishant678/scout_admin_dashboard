import { api } from '../lib';

export interface FinanceTransaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  category: string;
  referenceNumber: string;
  memberName: string | null;
  createdAt: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  membershipFees: number;
  totalExpenses: number;
  availableBalance: number;
  revenueGrowth: number;
  expenseChange: number;
  revenueBreakdown: { label: string; value: number }[];
}

export const getTransactions = (page = 0, size = 10, type?: string) =>
  api.get<{ data: { content: FinanceTransaction[]; page: number; size: number; totalElements: number; totalPages: number; last: boolean } }>('/finance', { params: { page, size, type } }).then(r => r.data.data);

export const getTransaction = (id: number) =>
  api.get<{ data: FinanceTransaction }>(`/finance/${id}`).then(r => r.data.data);

export const getFinanceSummary = () =>
  api.get<{ data: FinanceSummary }>('/finance/summary').then(r => r.data.data);

export interface CreateTransactionRequest {
  type: string;
  amount: number;
  description: string;
  category: string;
}

export const createTransaction = (data: CreateTransactionRequest) =>
  api.post<{ data: FinanceTransaction }>('/finance', data).then(r => r.data.data);
