import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui';
import DataTable from '../../components/tables/DataTable';
import { Users, UserPlus, Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers, createUser, toggleUserStatus, deleteUser, User } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';
import Modal from '../../components/dialogs/Modal';

const roleLabels: Record<string, string> = { ADMIN: 'Admin', LEADER: 'Scout Leader', USER: 'User' };
const roleColors: Record<string, string> = { ADMIN: 'bg-purple-100 text-purple-800', LEADER: 'bg-blue-100 text-blue-800', USER: 'bg-green-100 text-green-800' };

const UsersPage: React.FC = () => {
  const currentUser = useAuthStore(s => s.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState<{ userId: string; password: string } | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'USER' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadUsers = () => {
    setLoading(true);
    getUsers().then(setUsers).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { loadUsers(); }, []);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = 'Name required (min 2 chars)';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.role) e.role = 'Role required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setFormLoading(true);
    setCreatedResult(null);
    try {
      const res = await createUser(form);
      const userData = res.user || res;
      const password = res.password || 'Generated';
      setCreatedResult({ userId: userData.userId || '', password });
      toast.success('User created successfully');
      setForm({ name: '', email: '', phone: '', role: 'USER' });
      loadUsers();
    } catch { /* toast handled by interceptor */ }
    finally { setFormLoading(false); }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleUserStatus(id);
      toast.success('User status updated');
      loadUsers();
    } catch { /* toast handled by interceptor */ }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      loadUsers();
    } catch { /* toast handled by interceptor */ }
  };

  const canCreateAdmin = currentUser?.role === 'ADMIN';
  const canCreateLeader = currentUser?.role === 'ADMIN';

  const columns = [
    { header: 'User ID', accessorKey: 'userId',
      cell: (info: any) => <span className="font-mono text-sm font-bold text-primary-700">{info.getValue()}</span>,
    },
    { header: 'Name', accessorKey: 'name',
      cell: (info: any) => <span className="font-bold text-gray-900">{info.getValue()}</span>,
    },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'role',
      cell: (info: any) => <Badge variant="status" className={roleColors[info.getValue()] || ''}>{roleLabels[info.getValue()] || info.getValue()}</Badge>,
    },
    { header: 'Status', accessorKey: 'isActive',
      cell: (info: any) => <Badge variant="status" className={info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{info.getValue() ? 'Active' : 'Inactive'}</Badge>,
    },
    { header: 'Created', accessorKey: 'createdAt',
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    { header: 'Actions', id: 'actions',
      cell: (info: any) => {
        const u = info.row.original as User;
        return (
          <div className="flex gap-2">
            {currentUser?.role === 'ADMIN' && (
              <>
                <Button size="sm" variant={u.isActive ? 'secondary' : 'primary'} onClick={() => handleToggleStatus(Number(u.id))}>
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(Number(u.id))}>Delete</Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500">Manage system users and their roles</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={loadUsers}><RefreshCw size={16} className="mr-1" />Refresh</Button>
            <Button onClick={() => { setCreatedResult(null); setShowCreate(true); }}><UserPlus size={16} className="mr-1" />Create User</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4"><div className="flex items-center gap-3"><Users className="text-primary-600" size={24} /><div><p className="text-2xl font-bold">{users.length}</p><p className="text-sm text-gray-500">Total Users</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><Shield className="text-blue-600" size={24} /><div><p className="text-2xl font-bold">{users.filter(u => u.role === 'LEADER').length}</p><p className="text-sm text-gray-500">Scout Leaders</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><Users className="text-green-600" size={24} /><div><p className="text-2xl font-bold">{users.filter(u => u.role === 'USER').length}</p><p className="text-sm text-gray-500">Users</p></div></div></Card>
        </div>

        {loading ? <TableSkeleton /> : (
          <Card className="p-0 overflow-hidden">
            <DataTable columns={columns} data={users} />
          </Card>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setCreatedResult(null); }} title="Create New User">
        {createdResult ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-bold mb-2">User Created Successfully!</p>
              <div className="space-y-2 text-sm">
                <p><strong>User ID:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{createdResult.userId}</span></p>
                <p><strong>Password:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{createdResult.password}</span></p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Share these credentials with the user. They will need the User ID and password to log in to the mobile app.</p>
            </div>
            <Button className="w-full" onClick={() => { setShowCreate(false); setCreatedResult(null); }}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} error={formErrors.name} placeholder="John Doe" />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} error={formErrors.email} placeholder="john@example.com" />
            <Input label="Phone (optional)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+254..." />
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="USER">User</option>
                {canCreateLeader && <option value="LEADER">Scout Leader</option>}
                {canCreateAdmin && <option value="ADMIN">Admin</option>}
              </select>
              {formErrors.role && <p className="text-red-500 text-xs">{formErrors.role}</p>}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} isLoading={formLoading}>Create User</Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;
