import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui';
import DataTable from '../../components/tables/DataTable';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRegistrations, Registration } from '../../services/registrationService';
import { approveRegistration, rejectRegistration } from '../../services/approvalService';
import { formatDate } from '../../utils/formatters';

const ApprovalsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getRegistrations(0, 50, 'PENDING').then(r => setRegistrations(r.content)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    try { await approveRegistration(id, 'Approved'); toast.success('Registration approved'); load(); } catch { /* handled */ } finally { setActionLoading(false); }
  };

  const handleReject = async (id: number) => {
    setActionLoading(true);
    try { await rejectRegistration(id, 'Rejected'); toast.success('Registration rejected'); load(); } catch { /* handled */ } finally { setActionLoading(false); }
  };

  const columns = [
    { header: 'Name', accessorKey: 'name', cell: (info: any) => <span className="font-medium">{info.getValue()}</span> },
    { header: 'Section', accessorKey: 'section' },
    { header: 'Unit', accessorKey: 'unit' },
    { header: 'County', accessorKey: 'county' },
    { header: 'Submitted', accessorKey: 'submissionDate', cell: (info: any) => formatDate(info.getValue()) },
    { header: 'Actions', id: 'actions',
      cell: (info: any) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" disabled={actionLoading} onClick={() => handleApprove(info.row.original.id)}>
            <CheckCircle size={16} className="mr-1" /> Approve
          </Button>
          <Button variant="ghost" size="sm" disabled={actionLoading} onClick={() => handleReject(info.row.original.id)} className="text-red-600">
            <XCircle size={16} className="mr-1" /> Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Approvals">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2><p className="text-gray-500 mt-1">Review and approve pending registration requests</p></div>
        <Button variant="secondary" onClick={load}><Clock size={16} className="mr-1" /> Refresh</Button>
      </div>

      {loading ? <TableSkeleton rows={5} cols={6} /> : registrations.length === 0 ? (
        <Card className="text-center py-12">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">All caught up!</p>
          <p className="text-gray-400 mt-1">No pending approvals at the moment.</p>
        </Card>
      ) : (
        <DataTable data={registrations as any} columns={columns} pageSize={10} />
      )}
    </DashboardLayout>
  );
};

export default ApprovalsPage;
