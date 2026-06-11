import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/ui';
import DataTable from '../../components/tables/DataTable';
import { Shield, Search, Clock } from 'lucide-react';
import { getAuditLogs, getAuditStats, AuditLog, AuditStats } from '../../services/auditService';

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadAll = (p = page) => {
    setLoading(true);
    Promise.all([
      getAuditLogs(p, 10).then(r => { setLogs(r.content); setTotalPages(r.totalPages); }),
      getAuditStats().then(setStats),
    ]).finally(() => setLoading(false));
  };
  useEffect(() => { loadAll(); }, []);

  const filtered = search ? logs.filter(l =>
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entityType.toLowerCase().includes(search.toLowerCase())
  ) : logs;

  const auditColumns = [
    { header: 'Timestamp', accessorKey: 'createdAt', cell: (info: any) => { const d = new Date(info.getValue()); return <div className="flex flex-col"><span className="font-medium text-gray-900">{d.toLocaleDateString()}</span><span className="text-xs text-gray-500">{d.toLocaleTimeString()}</span></div>; } },
    { header: 'User', accessorKey: 'userName', cell: (info: any) => <span className="text-primary-600 font-medium">{info.getValue()}</span> },
    { header: 'Action', accessorKey: 'action', cell: (info: any) => { const a = info.getValue() as string; const c = a === 'CREATE' ? 'bg-green-100 text-green-800' : a === 'UPDATE' ? 'bg-blue-100 text-blue-800' : a === 'DELETE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'; return <span className={`px-2 py-1 rounded text-xs font-bold ${c}`}>{a}</span>; } },
    { header: 'Resource', accessorKey: 'entityType' },
    { header: 'Resource ID', accessorKey: 'entityId', cell: (info: any) => <span className="font-mono text-xs">{info.getValue()}</span> },
    { header: 'Status', id: 'status', cell: () => <Badge variant="status" status="approved">success</Badge> },
  ];

  return (
    <DashboardLayout title="Audit Logs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900">Security & Audit Logs</h2><p className="text-gray-500 mt-1">Monitor system activities and track administrative actions</p></div>
      </div>

      {!stats ? <CardSkeleton count={3} /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="flex items-center gap-4 bg-gray-50"><div className="p-3 bg-white rounded-lg shadow-sm"><Shield className="text-blue-600" size={24} /></div><div><p className="text-sm text-gray-500">Total Activities</p><p className="text-xl font-bold text-gray-900">{(stats?.totalActivities || 0).toLocaleString()}</p></div></Card>
          <Card className="flex items-center gap-4 bg-gray-50"><div className="p-3 bg-white rounded-lg shadow-sm"><Clock className="text-green-600" size={24} /></div><div><p className="text-sm text-gray-500">Success Rate</p><p className="text-xl font-bold text-gray-900">{stats?.successRate || 0}%</p></div></Card>
          <Card className="flex items-center gap-4 bg-gray-50"><div className="p-3 bg-white rounded-lg shadow-sm"><Shield className="text-red-600" size={24} /></div><div><p className="text-sm text-gray-500">Security Alerts</p><p className="text-xl font-bold text-gray-900">{stats?.securityAlerts || 0}</p></div></Card>
        </div>
      )}

      <div className="mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input placeholder="Search logs by user, action or resource..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <TableSkeleton rows={5} cols={6} /> : (
        <>
          <DataTable title="System Activity Log" data={filtered as any} columns={auditColumns} pageSize={10} />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => { const n = page - 1; setPage(n); loadAll(n); }}>Previous</Button>
              <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => { const n = page + 1; setPage(n); loadAll(n); }}>Next</Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default AuditLogsPage;
