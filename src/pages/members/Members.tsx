import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/ui';
import DataTable from '../../components/tables/DataTable';
import { Users, UserPlus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMembers, getMemberStats, createMember, Member, MemberStats } from '../../services/memberService';
import Modal from '../../components/dialogs/Modal';

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', section: '', unit: '', county: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadAll = (p = page) => {
    setLoading(true);
    Promise.all([
      getMembers(p, 10, search).then(r => { setMembers(r.content); setTotalPages(r.totalPages); }),
      getMemberStats().then(setStats),
    ]).finally(() => setLoading(false));
  };
  useEffect(() => { loadAll(); }, []);

  const filtered = search ? members.filter(m =>
    m.firstName.toLowerCase().includes(search.toLowerCase()) ||
    m.lastName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.unit.toLowerCase().includes(search.toLowerCase())
  ) : members;

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.firstName || form.firstName.length < 2) e.firstName = 'First name required (min 2 chars)';
    if (!form.lastName || form.lastName.length < 2) e.lastName = 'Last name required (min 2 chars)';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.section) e.section = 'Section required';
    if (!form.unit) e.unit = 'Unit required';
    if (!form.county) e.county = 'County required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      await createMember(form);
      toast.success('Member created successfully');
      setShowModal(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', section: '', unit: '', county: '' });
      setPage(0); loadAll(0);
    } catch { /* toast handled by interceptor */ }
    finally { setFormLoading(false); }
  };

  const memberColumns = [
    { header: 'Name', id: 'name',
      cell: (info: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
            {info.row.original.firstName?.[0]}{info.row.original.lastName?.[0]}
          </div>
          <div><span className="font-bold text-gray-900">{info.row.original.firstName} {info.row.original.lastName}</span><span className="text-xs text-gray-500 block">Joined {new Date(info.row.original.createdAt).toLocaleDateString()}</span></div>
        </div>
      ),
    },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Section', accessorKey: 'section',
      cell: (info: any) => <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">{info.getValue()}</span>,
    },
    { header: 'Unit / County', id: 'location',
      cell: (info: any) => <div><span className="text-sm font-medium text-gray-900">{info.row.original.unit}</span><span className="text-xs text-gray-500 block">{info.row.original.county}</span></div>,
    },
    { header: 'Status', accessorKey: 'status',
      cell: (info: any) => <Badge variant="status" status={info.getValue()}>{info.getValue()}</Badge>,
    },
  ];

  return (
    <DashboardLayout title="Members">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900">Member Management</h2><p className="text-gray-500 mt-1">Manage all registered scout members across Kenya</p></div>
        <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => setShowModal(true)}><UserPlus size={18} />Add New Member</Button>
      </div>

      {!stats ? <CardSkeleton count={3} /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-primary-50 border-primary-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg text-primary-700"><Users size={24} /></div>
              <div><p className="text-sm font-medium text-primary-700">Total Members</p><h3 className="text-2xl font-bold text-primary-900">{(stats?.totalMembers || 0).toLocaleString()}</h3></div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg text-green-700"><Users size={24} /></div>
              <div><p className="text-sm font-medium text-gray-500">Active Members</p><h3 className="text-2xl font-bold text-gray-900">{(stats?.activeMembers || 0).toLocaleString()}</h3></div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg text-yellow-700"><Users size={24} /></div>
              <div><p className="text-sm font-medium text-gray-500">Pending Renewal</p><h3 className="text-2xl font-bold text-gray-900">{(stats?.pendingRenewal || 0).toLocaleString()}</h3></div>
            </div>
          </Card>
        </div>
      )}

      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input placeholder="Search members by name, email, unit..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <TableSkeleton rows={5} cols={6} /> : (
        <>
          <DataTable data={filtered as any} columns={memberColumns} pageSize={10} />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => { const n = page - 1; setPage(n); loadAll(n); }}>Previous</Button>
              <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => { const n = page + 1; setPage(n); loadAll(n); }}>Next</Button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={showModal} onClose={() => !formLoading && setShowModal(false)} title="Add New Member" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {['firstName', 'lastName'].map(f => (
              <div key={f} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{f === 'firstName' ? 'First Name' : 'Last Name'}</label>
                <input value={(form as any)[f]} onChange={e => { setForm(p => ({ ...p, [f]: e.target.value })); setFormErrors(prev => { const n = { ...prev }; delete n[f]; return n; }); }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${formErrors[f] ? 'border-red-300 focus:ring-red-500/20' : 'border-gray-300 focus:ring-primary-500/20'}`} />
                {formErrors[f] && <p className="text-xs text-red-500">{formErrors[f]}</p>}
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setFormErrors(prev => { const n = { ...prev }; delete n.email; return n; }); }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${formErrors.email ? 'border-red-300 focus:ring-red-500/20' : 'border-gray-300 focus:ring-primary-500/20'}`} />
            {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['section', 'unit', 'county'].map(f => (
              <div key={f} className="space-y-1">
                <label className="text-sm font-medium text-gray-700 capitalize">{f}</label>
                <input value={(form as any)[f]} onChange={e => { setForm(p => ({ ...p, [f]: e.target.value })); setFormErrors(prev => { const n = { ...prev }; delete n[f]; return n; }); }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${formErrors[f] ? 'border-red-300 focus:ring-red-500/20' : 'border-gray-300 focus:ring-primary-500/20'}`} />
                {formErrors[f] && <p className="text-xs text-red-500">{formErrors[f]}</p>}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={formLoading}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd} disabled={formLoading} isLoading={formLoading}>Add Member</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default MembersPage;
