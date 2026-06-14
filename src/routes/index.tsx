import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DashboardPage from '../pages/dashboard/Dashboard';
import RegistrationsPage from '../pages/registrations/Registrations';
import ApprovalsPage from '../pages/approvals/Approvals';
import MembersPage from '../pages/members/Members';
import UnitsPage from '../pages/units/Units';
import FinancePage from '../pages/finance/Finance';
import ReportsPage from '../pages/reports/Reports';
import AuditLogsPage from '../pages/audit/AuditLogs';
import SettingsPage from '../pages/settings/Settings';
import SectionsPage from '../pages/sections/Sections';
import CountiesPage from '../pages/counties/Counties';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/registrations" element={<ProtectedRoute><RegistrationsPage /></ProtectedRoute>} />
        <Route path="/sections" element={<ProtectedRoute><SectionsPage /></ProtectedRoute>} />
        <Route path="/counties" element={<ProtectedRoute><CountiesPage /></ProtectedRoute>} />
        <Route path="/approvals" element={<ProtectedRoute><ApprovalsPage /></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
        <Route path="/units" element={<ProtectedRoute><UnitsPage /></ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
