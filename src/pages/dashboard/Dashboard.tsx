import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Users, CheckCircle, MapPin, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { AnalyticsCard } from '../../components/analytics';
import { LineChartComponent, PieChartComponent } from '../../components/charts';
import { DataTable } from '../../components/tables';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui';
import { ColumnDef } from '@tanstack/react-table';
import { getDashboardMetrics, DashboardMetrics } from '../../services/dashboardService';
import { getRegistrations, Registration as Reg } from '../../services/registrationService';
import { CHART_COLORS } from '../../constants';
import { formatDate } from '../../utils/formatters';

const PIE_FILLS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.warning, CHART_COLORS.danger];

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [registrations, setRegistrations] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getDashboardMetrics(),
      getRegistrations(0, 5).then(r => r.content),
    ]).then(([m, regs]) => {
      setMetrics(m);
      setRegistrations(regs);
    }).catch((err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load dashboard data';
      setError(msg);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const columns = useMemo<ColumnDef<Reg>[]>(() => [
    { accessorKey: 'name', header: 'Name',
      cell: (info) => <div><p className="font-medium text-gray-900">{info.getValue() as string}</p><p className="text-xs text-gray-500">{(info.row.original as Reg).email}</p></div> },
    { accessorKey: 'section', header: 'Section',
      cell: (info) => <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">{info.getValue() as string}</span> },
    { accessorKey: 'unit', header: 'Unit' },
    { accessorKey: 'county', header: 'County' },
    { accessorKey: 'submissionDate', header: 'Date', cell: (info) => <span>{formatDate(info.getValue() as string)}</span> },
    { accessorKey: 'status', header: 'Status',
      cell: (info) => <Badge variant="status" status={info.getValue() as 'pending' | 'approved' | 'rejected'}>{(info.getValue() as string).charAt(0).toUpperCase() + (info.getValue() as string).slice(1)}</Badge> },
  ], []);

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-red-50 rounded-full p-4 mb-4"><AlertTriangle size={48} className="text-red-400" /></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">{error}</p>
          <Button variant="primary" onClick={load} className="flex items-center gap-2"><RefreshCw size={18} />Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <CardSkeleton count={5} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 animate-pulse border border-gray-100"><div className="h-64 bg-gray-200 rounded" /></div>
          <div className="bg-white rounded-xl p-6 animate-pulse border border-gray-100"><div className="h-64 bg-gray-200 rounded" /></div>
        </div>
      </DashboardLayout>
    );
  }

  const m = metrics;
  const lineData = m?.registrationsOverview?.map(d => ({ name: d.label, value: d.value })) || [];
  const sectionData = m?.membersBySection?.map((d, i) => ({ name: d.label, value: d.value, fill: PIE_FILLS[i % PIE_FILLS.length] })) || [];
  const revenueData = m?.revenueBreakdown?.map((d, i) => ({ name: d.label, value: d.value, fill: PIE_FILLS[i % PIE_FILLS.length] })) || [];

  return (
    <DashboardLayout title="Dashboard">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <AnalyticsCard title="Total Members" value={m?.totalMembers.current || 0} change={m?.totalMembers.change || 0} trend={(m?.totalMembers.trend || 'up') as 'up'} icon={<Users className="w-6 h-6 text-primary-600" />} bgColor="bg-primary-50" delay={0} />
        <AnalyticsCard title="Pending Approvals" value={m?.pendingApprovals.current || 0} change={m?.pendingApprovals.change || 0} trend={(m?.pendingApprovals.trend || 'up') as 'up'} icon={<CheckCircle className="w-6 h-6 text-orange-500" />} bgColor="bg-orange-50" delay={0.1} />
        <AnalyticsCard title="Total Units" value={m?.totalUnits.current || 0} change={m?.totalUnits.change || 0} trend={(m?.totalUnits.trend || 'up') as 'up'} icon={<MapPin className="w-6 h-6 text-purple-600" />} bgColor="bg-purple-50" delay={0.2} />
        <AnalyticsCard title="Total Revenue (KES)" value={m?.totalRevenue.current || 0} change={m?.totalRevenue.change || 0} trend={(m?.totalRevenue.trend || 'up') as 'up'} icon={<DollarSign className="w-6 h-6 text-green-600" />} bgColor="bg-green-50" delay={0.3} />
        <AnalyticsCard title="Active Counties" value={m?.activeCounties.current || 0} change={0} trend="up" icon={<span className="text-2xl">{m?.activeCounties.current || 0}/{m?.activeCounties.total || 47}</span>} bgColor="bg-blue-50" delay={0.4} />
      </section>

      {lineData.length > 0 || sectionData.length > 0 ? (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2"><LineChartComponent title="Registrations Overview" data={lineData} height={300} delay={0.1} /></div>
          <PieChartComponent title="Members by Section" data={sectionData} height={300} delay={0.2} />
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2"><div className="h-64 flex items-center justify-center"><p className="text-gray-400">No registration data available</p></div></Card>
          <Card><div className="h-64 flex items-center justify-center"><p className="text-gray-400">No section data available</p></div></Card>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {revenueData.length > 0 ? (
          <PieChartComponent title="Revenue Distribution (KES)" data={revenueData} height={300} delay={0.3} />
        ) : (
          <Card><div className="h-64 flex items-center justify-center"><p className="text-gray-400">No revenue data available</p></div></Card>
        )}
        <Card><h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="primary" className="w-full">Add New Member</Button>
            <Button variant="secondary" className="w-full">Process Approvals</Button>
            <Button variant="ghost" className="w-full">Generate Report</Button>
            <Button variant="ghost" className="w-full">Export Data</Button>
          </div>
        </Card>
      </section>

      <section className="mb-8">
        <DataTable title="Recent Registrations" data={registrations as any} columns={columns as any} pageSize={5} />
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;
