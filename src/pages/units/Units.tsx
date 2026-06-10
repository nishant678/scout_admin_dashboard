import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/ui';
import DataTable from '../../components/tables/DataTable';
import { MapPin, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUnits, getUnitStats, createUnit, Unit, UnitStats } from '../../services/unitService';
import { getCounties, County } from '../../services/sectionService';
import Modal from '../../components/dialogs/Modal';

const UnitsPage: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [stats, setStats] = useState<UnitStats | null>(null);
  const [counties, setCounties] = useState<County[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', county: '', coordinator: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadAll = (p = page) => {
    setLoading(true);
    Promise.all([
      getUnits(p, 10).then(r => { setUnits(r.content); setTotalPages(r.totalPages); }),
      getUnitStats().then(setStats),
      getCounties().then(setCounties),
    ]).finally(() => setLoading(false));
  };
  useEffect(() => { loadAll(); }, []);

  const filtered = search ? units.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.code.toLowerCase().includes(search.toLowerCase()) ||
    u.county.toLowerCase().includes(search.toLowerCase())
  ) : units;

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = 'Name required (min 2 chars)';
    if (!form.code || form.code.length < 2) e.code = 'Code required';
    if (!form.county) e.county = 'County required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      await createUnit(form);
      toast.success('Unit created successfully');
      setShowModal(false); setForm({ name: '', code: '', county: '', coordinator: '' }); setPage(0); loadAll(0);
    } catch { /* handled */ } finally { setFormLoading(false); }
  };

  const unitColumns = [
    { header: 'Unit Name', accessorKey: 'name',
      cell: (info: any) => <div className="flex items-center gap-2"><div className="w-8 h-8 rounded bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">{info.getValue().substring(0, 2).toUpperCase()}</div><span className="font-medium text-gray-900">{info.getValue()}</span></div>,
    },
    { header: 'Code', accessorKey: 'code' },
    { header: 'County', accessorKey: 'county' },
    { header: 'Coordinator', accessorKey: 'coordinator', cell: (info: any) => info.getValue() || '-' },
    { header: 'Status', accessorKey: 'active', cell: (info: any) => <Badge variant="status" status={info.getValue() ? 'active' : 'inactive'}>{info.getValue() ? 'Active' : 'Inactive'}</Badge> },
  ];

  const topCounties = stats?.topCounties || [];

  return (
    <DashboardLayout title="Units & Locations">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900">Unit & Location Management</h2><p className="text-gray-500 mt-1">Oversee all scout units across Kenya</p></div>
        <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={18} />Add New Unit</Button>
      </div>

      {!stats ? <CardSkeleton count={3} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900">Regional Overview</h3><div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} /><span>{counties.length} Counties</span></div></div>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center"><MapPin size={48} className="text-gray-400 mx-auto mb-2" /><p className="text-gray-500">Interactive Map Component</p><p className="text-xs text-gray-400">(Requires Map Provider Configuration)</p></div>
            </div>
          </Card>
          <div className="space-y-6">
            <Card><h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"><div className="text-sm font-medium text-blue-800">Total Units</div><div className="text-xl font-bold text-blue-900">{(stats?.totalUnits || 0).toLocaleString()}</div></div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"><div className="text-sm font-medium text-green-800">Total Counties</div><div className="text-xl font-bold text-green-900">{stats?.totalCounties || 0}</div></div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100"><div className="text-sm font-medium text-purple-800">Average Unit Size</div><div className="text-xl font-bold text-purple-900">{Math.round(stats?.averageUnitSize || 0)}</div></div>
              </div>
            </Card>
            <Card><h3 className="text-lg font-bold text-gray-900 mb-4">Top Counties</h3>
              <div className="space-y-3">
                {topCounties.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-700">{c.name}</span><span className="font-semibold text-gray-900">{c.units} units</span></div>
                ))}
                {topCounties.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><Input placeholder="Search units by name, code or county..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} /></div>
      </div>

      {loading ? <TableSkeleton rows={5} cols={5} /> : (
        <>
          <DataTable title="All Scouting Units" data={filtered as any} columns={unitColumns} pageSize={10} />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => { const n = page - 1; setPage(n); loadAll(n); }}>Previous</Button>
              <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => { const n = page + 1; setPage(n); loadAll(n); }}>Next</Button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={showModal} onClose={() => !formLoading && setShowModal(false)} title="Add New Unit" size="md">
        <div className="space-y-4">
          {['name', 'code', 'county', 'coordinator'].map(f => (
            <div key={f} className="space-y-1">
              <label className="text-sm font-medium text-gray-700 capitalize">{f === 'coordinator' ? 'Coordinator (optional)' : f}</label>
              <input value={(form as any)[f]} onChange={e => { setForm(p => ({ ...p, [f]: e.target.value })); setFormErrors(prev => { const n = { ...prev }; delete n[f]; return n; }); }}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${formErrors[f] ? 'border-red-300 focus:ring-red-500/20' : 'border-gray-300 focus:ring-primary-500/20'}`} />
              {formErrors[f] && <p className="text-xs text-red-500">{formErrors[f]}</p>}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={formLoading}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd} disabled={formLoading} isLoading={formLoading}>Add Unit</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UnitsPage;
