import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/ui';
import DataTable from '../../components/tables/DataTable';
import { DollarSign, Download, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTransactions, getFinanceSummary, createTransaction, FinanceTransaction, FinanceSummary } from '../../services/financeService';
import { PieChartComponent } from '../../components/charts';
import { CHART_COLORS } from '../../constants';
import Modal from '../../components/dialogs/Modal';

const PIE_FILLS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.warning, CHART_COLORS.danger];

const FinancePage: React.FC = () => {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ type: 'INCOME', amount: '', description: '', category: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadAll = (p = page) => {
    setLoading(true);
    Promise.all([
      getTransactions(p, 5).then(r => { setTransactions(r.content); setTotalPages(r.totalPages); }),
      getFinanceSummary().then(setSummary),
    ]).finally(() => setLoading(false));
  };
  useEffect(() => { loadAll(); }, []);

  const s = summary;
  const revenueData = s?.revenueBreakdown?.map((d, i) => ({ name: d.label, value: d.value, fill: PIE_FILLS[i % PIE_FILLS.length] })) || [];

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.type) e.type = 'Type required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Valid amount required';
    if (!form.description || form.description.length < 3) e.description = 'Description required (min 3 chars)';
    if (!form.category) e.category = 'Category required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      await createTransaction({ type: form.type, amount: Number(form.amount), description: form.description, category: form.category });
      toast.success('Transaction added');
      setShowModal(false); setForm({ type: 'INCOME', amount: '', description: '', category: '' }); setPage(0); loadAll(0);
    } catch { /* handled */ } finally { setFormLoading(false); }
  };

  const transactionColumns = [
    { header: 'Reference', accessorKey: 'referenceNumber', cell: (info: any) => <span className="font-mono text-xs font-medium">{info.getValue()}</span> },
    { header: 'Description', accessorKey: 'description', cell: (info: any) => <span className="font-medium text-gray-900">{info.getValue()}</span> },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Amount', accessorKey: 'amount', cell: (info: any) => { const row = info.row.original as FinanceTransaction; return <span className={row.type === 'INCOME' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{row.type === 'INCOME' ? '+' : '-'} KES {info.getValue()?.toLocaleString()}</span>; } },
    { header: 'Date', accessorKey: 'createdAt', cell: (info: any) => new Date(info.getValue()).toLocaleDateString() },
  ];

  return (
    <DashboardLayout title="Finance">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900">Financial Management</h2><p className="text-gray-500 mt-1">Track revenue and expenses</p></div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="flex items-center gap-2"><Download size={18} />Export</Button>
          <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={18} />Add Transaction</Button>
        </div>
      </div>

      {!s ? <CardSkeleton count={4} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="border-l-4 border-green-500"><div className="flex items-center gap-4"><div className="p-3 bg-green-100 rounded-lg text-green-600"><TrendingUp size={24} /></div><div><p className="text-sm font-medium text-gray-500">Total Revenue</p><h3 className="text-2xl font-bold text-gray-900">KES {(s?.totalRevenue || 0).toLocaleString()}</h3></div></div></Card>
          <Card className="border-l-4 border-blue-500"><div className="flex items-center gap-4"><div className="p-3 bg-blue-100 rounded-lg text-blue-600"><DollarSign size={24} /></div><div><p className="text-sm font-medium text-gray-500">Membership Fees</p><h3 className="text-2xl font-bold text-gray-900">KES {(s?.membershipFees || 0).toLocaleString()}</h3></div></div></Card>
          <Card className="border-l-4 border-red-500"><div className="flex items-center gap-4"><div className="p-3 bg-red-100 rounded-lg text-red-600"><TrendingDown size={24} /></div><div><p className="text-sm font-medium text-gray-500">Expenses</p><h3 className="text-2xl font-bold text-gray-900">KES {(s?.totalExpenses || 0).toLocaleString()}</h3></div></div></Card>
          <Card className="border-l-4 border-purple-500"><div className="flex items-center gap-4"><div className="p-3 bg-purple-100 rounded-lg text-purple-600"><DollarSign size={24} /></div><div><p className="text-sm font-medium text-gray-500">Balance</p><h3 className="text-2xl font-bold text-gray-900">KES {(s?.availableBalance || 0).toLocaleString()}</h3></div></div></Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Breakdown</h3>
          <div className="h-64"><PieChartComponent title="Revenue Sources" data={revenueData} /></div>
          <div className="mt-6 space-y-3">{revenueData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div><span className="text-gray-600">{item.name}</span></div>
              <span className="font-semibold text-gray-900">KES {(item.value / 1000).toFixed(0)}K</span>
            </div>
          ))}</div>
        </Card>
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
          {loading ? <TableSkeleton rows={5} cols={5} /> : (
            <>
              <DataTable data={transactions as any} columns={transactionColumns} pageSize={5} />
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => { const n = page - 1; setPage(n); loadAll(n); }}>Previous</Button>
                  <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
                  <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => { const n = page + 1; setPage(n); loadAll(n); }}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => !formLoading && setShowModal(false)} title="Add Transaction" size="md">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20">
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          {['amount', 'description', 'category'].map(f => (
            <div key={f} className="space-y-1">
              <label className="text-sm font-medium text-gray-700 capitalize">{f}</label>
              <input value={(form as any)[f]} onChange={e => { setForm(p => ({ ...p, [f]: e.target.value })); setFormErrors(prev => { const n = { ...prev }; delete n[f]; return n; }); }}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${formErrors[f] ? 'border-red-300 focus:ring-red-500/20' : 'border-gray-300 focus:ring-primary-500/20'}`} />
              {formErrors[f] && <p className="text-xs text-red-500">{formErrors[f]}</p>}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={formLoading}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd} disabled={formLoading} isLoading={formLoading}>Add Transaction</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default FinancePage;
