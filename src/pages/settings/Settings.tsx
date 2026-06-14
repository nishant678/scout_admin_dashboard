import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { User, Bell, Shield, Globe, Database, Check, Loader, Eye, EyeOff } from 'lucide-react';
import Switch from '../../components/ui/Switch';
import toast from 'react-hot-toast';
import {
  getProfile, updateProfile, getNotifications, updateNotifications,
  changePassword, getRegionalSettings, updateRegionalSettings,
  purgeAuditLogs, resetCache,
  Profile, NotificationPrefs, RegionalSettings,
} from '../../services/settingsService';

type Tab = 'profile' | 'notifications' | 'security' | 'regional' | 'data';

const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'profile', icon: <User size={18} />, label: 'Profile Settings' },
  { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
  { id: 'security', icon: <Shield size={18} />, label: 'Change Password' },
  { id: 'regional', icon: <Globe size={18} />, label: 'Regional Settings' },
  { id: 'data', icon: <Database size={18} />, label: 'Data Management' },
];

const TIMEZONES = ['Africa/Nairobi', 'Africa/Lagos', 'Africa/Cairo', 'Africa/Johannesburg', 'America/New_York', 'Europe/London', 'Asia/Dubai'];
const CURRENCIES = ['KES', 'USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'AED'];
const DATE_FORMATS = ['MMM d, yyyy', 'MMMM d, yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy'];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [notifications, setNotifications] = useState<NotificationPrefs | null>(null);
  const [savingNotifs, setSavingNotifs] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [regional, setRegional] = useState<RegionalSettings | null>(null);
  const [savingRegional, setSavingRegional] = useState(false);

  useEffect(() => {
    Promise.all([
      getProfile().then(setProfile),
      getNotifications().then(setNotifications),
      getRegionalSettings().then(setRegional),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSavingProfile(true);
    try { setProfile(await updateProfile(profile)); toast.success('Profile updated'); } catch { } finally { setSavingProfile(false); }
  };

  const handleSaveNotifications = async () => {
    if (!notifications) return;
    setSavingNotifs(true);
    try { setNotifications(await updateNotifications(notifications)); toast.success('Notification preferences updated'); } catch { } finally { setSavingNotifs(false); }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All fields are required'); return;
    }
    if (passwordForm.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSavingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { } finally { setSavingPassword(false); }
  };

  const handleSaveRegional = async () => {
    if (!regional) return;
    setSavingRegional(true);
    try { setRegional(await updateRegionalSettings(regional)); toast.success('Regional settings updated'); } catch { } finally { setSavingRegional(false); }
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <div className="mb-6"><div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2" /><div className="h-4 bg-gray-200 rounded animate-pulse w-64" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-1">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />)}</div>
          <div className="lg:col-span-3 space-y-6"><div className="bg-white rounded-xl p-6 animate-pulse border border-gray-100"><div className="h-64 bg-gray-200 rounded" /></div></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">System Settings</h2><p className="text-gray-500 mt-1">Configure your account and system-wide preferences</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-1">
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(['name', 'email', 'phone'] as const).map(f => (
                  <div key={f} className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 capitalize">{f === 'phone' ? 'Phone Number' : f === 'name' ? 'Full Name' : 'Email Address'}</label>
                    <input value={(profile as any)?.[f] || ''} onChange={e => setProfile(p => p ? { ...p, [f]: e.target.value } : p)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <input value={profile?.role || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" />
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                <Button variant="primary" className="flex items-center gap-2" onClick={handleSaveProfile} disabled={savingProfile} isLoading={savingProfile}><Check size={18} />Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                {[
                  { key: 'email' as const, icon: <Bell className="text-blue-600" size={20} />, title: 'Email Notifications', desc: 'Receive weekly summaries and important alerts via email' },
                  { key: 'sms' as const, icon: <Bell className="text-green-600" size={20} />, title: 'SMS Alerts', desc: 'Critical system notifications sent directly to your phone' },
                  { key: 'security' as const, icon: <Shield className="text-purple-600" size={20} />, title: 'Security Reports', desc: 'Monthly audit log summaries and login activity reports' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">{item.icon}</div>
                      <div><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
                    </div>
                    <Switch checked={notifications?.[item.key] ?? false} onCheckedChange={v => setNotifications(p => p ? { ...p, [item.key]: v } : p)} />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                <Button variant="primary" className="flex items-center gap-2" onClick={handleSaveNotifications} disabled={savingNotifs} isLoading={savingNotifs}><Check size={18} />Save Preferences</Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
              <div className="space-y-4 max-w-md">
                {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map(f => (
                  <div key={f} className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {f === 'currentPassword' ? 'Current Password' : f === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                    </label>
                    <div className="relative">
                      <input type={showPasswords ? 'text' : 'password'} value={passwordForm[f]} onChange={e => setPasswordForm(p => ({ ...p, [f]: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                      <button type="button" onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                <Button variant="primary" className="flex items-center gap-2" onClick={handleChangePassword} disabled={savingPassword} isLoading={savingPassword}><Shield size={18} />Change Password</Button>
              </div>
            </Card>
          )}

          {activeTab === 'regional' && (
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Regional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
                {[
                  { key: 'timezone' as const, label: 'Timezone', options: TIMEZONES },
                  { key: 'currency' as const, label: 'Currency', options: CURRENCIES },
                  { key: 'dateFormat' as const, label: 'Date Format', options: DATE_FORMATS },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{f.label}</label>
                    <select value={regional?.[f.key] || f.options[0]} onChange={e => setRegional(p => p ? { ...p, [f.key]: e.target.value } : p)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                <Button variant="primary" className="flex items-center gap-2" onClick={handleSaveRegional} disabled={savingRegional} isLoading={savingRegional}><Check size={18} />Save Settings</Button>
              </div>
            </Card>
          )}

          {activeTab === 'data' && (
            <>
              <Card className="border-red-100 bg-red-50">
                <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-6">Irreversible actions that affect system data</p>
                <div className="flex flex-col md:flex-row gap-4">
                  <Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-100"
                    onClick={() => { purgeAuditLogs().then(() => toast.success('Old audit logs purged')).catch(() => {}); }}>
                    Purge Old Audit Logs
                  </Button>
                  <Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-100"
                    onClick={() => { resetCache().then(() => toast.success('Cache reset initiated')).catch(() => {}); }}>
                    Reset System Cache
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
