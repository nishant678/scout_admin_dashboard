import React, { useMemo, useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { DataTable } from '../../components/tables';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui';
import { Modal } from '../../components/dialogs';
import RegistrationForm from '../../components/forms/RegistrationForm';
import { ColumnDef } from '@tanstack/react-table';
import { getRegistrations, createRegistration, Registration } from '../../services/registrationService';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const RegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = (p = page) => {
    setIsLoading(true);
    getRegistrations(p, 10).then(r => { setRegistrations(r.content); setTotalPages(r.totalPages); }).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const columns = useMemo<ColumnDef<Registration>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'section', header: 'Section' },
    { accessorKey: 'unit', header: 'Unit' },
    { accessorKey: 'county', header: 'County' },
    { accessorKey: 'submissionDate', header: 'Date', cell: (info) => formatDate(info.getValue() as string) },
    { accessorKey: 'status', header: 'Status',
      cell: (info) => <Badge variant="status" status={info.getValue() as 'pending' | 'approved' | 'rejected'}>{(info.getValue() as string).charAt(0).toUpperCase() + (info.getValue() as string).slice(1)}</Badge> },
  ], []);

  const handleSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await createRegistration({ name: data.name, email: data.email, phone: data.phone, section: data.section, unit: data.unit, county: data.county });
      toast.success('Registration created successfully');
      setPage(0); load(0);
      setIsModalOpen(false);
    } catch { /* handled by interceptor */ }
    finally { setIsSaving(false); }
  };

  return (
    <DashboardLayout title="Registrations">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-900">All Registrations</h2><p className="text-gray-500 mt-1">Manage new member registrations</p></div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ New Registration</Button>
      </div>

      {isLoading ? <TableSkeleton rows={5} cols={6} /> : (
        <>
          <DataTable data={registrations as any} columns={columns as any} pageSize={10} />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => { const n = page - 1; setPage(n); load(n); }}>Previous</Button>
              <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => { const n = page + 1; setPage(n); load(n); }}>Next</Button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => !isSaving && setIsModalOpen(false)} title="New Member Registration" size="lg">
        <RegistrationForm onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} isLoading={isSaving} />
      </Modal>
    </DashboardLayout>
  );
};

export default RegistrationsPage;
