import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Bell, Shield, Globe, Database, Mail, Smartphone, Check } from 'lucide-react';
import Switch from '../../components/ui/Switch';
import toast from 'react-hot-toast';
import { getProfile, updateProfile, purgeAuditLogs, resetCache, Profile } from '../../services/settingsService';

interface FormErrors {
  name?: string;
  email?: string;
}

const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => { getProfile().then(setProfile).finally(() => setLoading(false)); }, []);

  const validate = () => {
    const e: FormErrors = {};
    if (!profile?.name || profile.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!profile?.email || !/\S+@\S+\.\S+/.test(profile.email)) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!profile || !validate()) return;
    setSaving(true);
    try { await updateProfile(profile); toast.success('Profile updated'); } catch { /* handled */ } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <div className="mb-6"><div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2" /><div className="h-4 bg-gray-200 rounded animate-pulse w-64" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-1">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />)}</div>
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl p-6 animate-pulse border border-gray-100"><div className="h-64 bg-gray-200 rounded" /></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">System Settings</h2><p className="text-gray-500 mt-1">Configure your account and system-wide preferences</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-1">
          {[
            { icon: <User size={18} />, label: 'Profile Settings' },
            { icon: <Bell size={18} />, label: 'Notifications' },
            { icon: <Shield size={18} />, label: 'Security & Privacy' },
            { icon: <Globe size={18} />, label: 'Regional Settings' },
            { icon: <Database size={18} />, label: 'Data Management' },
          ].map((tab, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${i === 0 ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}>{tab.icon}{tab.label}</button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['name', 'email', 'phone'] as const).map(f => (
                <div key={f} className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 capitalize">{f === 'phone' ? 'Phone Number (optional)' : f === 'name' ? 'Full Name' : 'Email Address'}</label>
                  <input value={(profile as any)?.[f] || ''} onChange={e => { setProfile(p => p ? { ...p, [f]: e.target.value } : p); if (f !== 'phone') setErrors(prev => ({ ...prev, [f]: undefined })); }}
                    disabled={f === 'phone'}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors[f as keyof FormErrors] ? 'border-red-300 focus:ring-red-500/20' : 'border-gray-300 focus:ring-primary-500/20'} ${f === 'phone' ? 'bg-gray-50' : ''}`} />
                  {errors[f as keyof FormErrors] && <p className="text-xs text-red-500">{errors[f as keyof FormErrors]}</p>}
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <input value={profile?.role || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
              <Button variant="primary" className="flex items-center gap-2" onClick={handleSave} disabled={saving} isLoading={saving}><Check size={18} />Save Changes</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
            <div className="space-y-6">
              {[
                { icon: <Mail className="text-blue-600" size={20} />, title: 'Email Notifications', desc: 'Receive weekly summaries and important alerts via email', checked: true },
                { icon: <Smartphone className="text-green-600" size={20} />, title: 'SMS Alerts', desc: 'Critical system notifications sent directly to your phone', checked: false },
                { icon: <Shield className="text-purple-600" size={20} />, title: 'Security Reports', desc: 'Monthly audit log summaries and login activity reports', checked: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between"><div className="flex gap-4"><div className="p-2 bg-blue-50 rounded-lg">{item.icon}</div><div><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-500">{item.desc}</p></div></div><Switch checked={item.checked} onCheckedChange={() => {}} /></div>
              ))}
            </div>
          </Card>

          <Card className="border-red-100 bg-red-50">
            <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-6">Irreversible actions that affect system data</p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-100" onClick={() => { purgeAuditLogs().then(() => toast.success('Old audit logs purged')).catch(() => {}); }}>
                Purge Old Audit Logs
              </Button>
              <Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-100" onClick={() => { resetCache().then(() => toast.success('Cache reset initiated')).catch(() => {}); }}>
                Reset System Cache
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
