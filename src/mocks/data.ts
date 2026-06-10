import type {
  Member,
  Registration,
  Approval,
  Transaction,
  Unit,
  County,
  AuditLog,
  User,
} from '../types';

// Mock Dashboard Metrics
export const mockDashboardMetrics = {
  totalMembers: 24758,
  totalMembersChange: 1548,
  totalMembersChartData: [
    { name: 'May 4', value: 23500 },
    { name: 'May 7', value: 23800 },
    { name: 'May 8', value: 24100 },
    { name: 'May 9', value: 24200 },
    { name: 'May 10', value: 24450 },
    { name: 'May 11', value: 24758 },
  ],
  pendingApprovals: 1248,
  pendingApprovalsChange: 93,
  totalUnits: 3562,
  totalUnitsChange: 43,
  totalRevenue: 2475800,
  totalRevenueChange: 120450,
  activeCounties: { current: 47, total: 47 },
};

// Mock Members
export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'John Kamau',
    email: 'john.kamau@scout.co.ke',
    phone: '+254712345678',
    section: 'Scouts',
    status: 'active',
    joinDate: '2023-06-15',
    county: 'Nairobi',
    unit: 'Nairobi Central',
  },
  {
    id: '2',
    name: 'Mary Okonkwo',
    email: 'mary.okonkwo@scout.co.ke',
    phone: '+254723456789',
    section: 'Ventures',
    status: 'active',
    joinDate: '2023-08-20',
    county: 'Mombasa',
    unit: 'Mombasa South',
  },
  {
    id: '3',
    name: 'David Kipchoge',
    email: 'david.kipchoge@scout.co.ke',
    phone: '+254734567890',
    section: 'Rovers',
    status: 'active',
    joinDate: '2023-05-10',
    county: 'Nakuru',
    unit: 'Nakuru East',
  },
  {
    id: '4',
    name: 'Sarah Muthoni',
    email: 'sarah.muthoni@scout.co.ke',
    phone: '+254745678901',
    section: 'Cubs',
    status: 'suspended',
    joinDate: '2023-09-01',
    county: 'Kisumu',
    unit: 'Kisumu Town',
  },
  {
    id: '5',
    name: 'James Mutua',
    email: 'james.mutua@scout.co.ke',
    phone: '+254756789012',
    section: 'Beavers',
    status: 'active',
    joinDate: '2023-07-22',
    county: 'Uasin Gishu',
    unit: 'Eldoret West',
  },
];

// Mock Registrations
export const mockRegistrations: Registration[] = [
  {
    id: 'REG001',
    name: 'Peter Ndung\'u',
    email: 'peter.ndungu@email.com',
    phone: '+254701111111',
    section: 'Scouts',
    unit: 'Nairobi Central',
    county: 'Nairobi',
    submissionDate: '2024-05-10',
    status: 'pending',
    age: 16,
  },
  {
    id: 'REG002',
    name: 'Grace Njeri',
    email: 'grace.njeri@email.com',
    phone: '+254702222222',
    section: 'Ventures',
    unit: 'Mombasa South',
    county: 'Mombasa',
    submissionDate: '2024-05-09',
    status: 'approved',
    age: 18,
  },
  {
    id: 'REG003',
    name: 'Moses Kiplagat',
    email: 'moses.kiplagat@email.com',
    phone: '+254703333333',
    section: 'Cubs',
    unit: 'Nakuru East',
    county: 'Nakuru',
    submissionDate: '2024-05-11',
    status: 'pending',
    age: 12,
  },
  {
    id: 'REG004',
    name: 'Lucy Wanjiru',
    email: 'lucy.wanjiru@email.com',
    phone: '+254704444444',
    section: 'Beavers',
    unit: 'Kisumu Town',
    county: 'Kisumu',
    submissionDate: '2024-05-12',
    status: 'pending',
    age: 8,
  },
];

// Mock Approvals
export const mockApprovals: Approval[] = [
  {
    id: 'APR001',
    type: 'member',
    title: 'New Member Registration - Scouts',
    submittedBy: 'Unit Coordinator',
    submittedDate: '2024-05-10',
    dueDate: '2024-05-20',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'APR002',
    type: 'event',
    title: 'Annual Campfire Event Approval',
    submittedBy: 'Events Team',
    submittedDate: '2024-05-08',
    dueDate: '2024-05-18',
    status: 'approved',
    priority: 'medium',
  },
  {
    id: 'APR003',
    type: 'budget',
    title: 'Q2 Budget Allocation Request',
    submittedBy: 'Finance Manager',
    submittedDate: '2024-05-05',
    dueDate: '2024-05-15',
    status: 'pending',
    priority: 'high',
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'TRX001',
    date: '2024-05-12',
    description: 'Member Registration Fees',
    category: 'Income',
    amount: 45000,
    type: 'income',
    status: 'completed',
    reference: 'REF-2024-001',
  },
  {
    id: 'TRX002',
    date: '2024-05-11',
    description: 'Scout Uniform Supplies',
    category: 'Expense',
    amount: 28000,
    type: 'expense',
    status: 'completed',
    reference: 'REF-2024-002',
  },
  {
    id: 'TRX003',
    date: '2024-05-10',
    description: 'Training Program Fund',
    category: 'Income',
    amount: 120000,
    type: 'income',
    status: 'completed',
    reference: 'REF-2024-003',
  },
];

// Mock Units
export const mockUnits: Unit[] = [
  {
    id: 'UNT001',
    name: 'Nairobi Central',
    code: 'NC-001',
    county: 'Nairobi',
    members: 450,
    status: 'active',
  },
  {
    id: 'UNT002',
    name: 'Mombasa South',
    code: 'MB-002',
    county: 'Mombasa',
    members: 380,
    status: 'active',
  },
  {
    id: 'UNT003',
    name: 'Nakuru East',
    code: 'NK-003',
    county: 'Nakuru',
    members: 290,
    status: 'active',
  },
];

// Mock Counties
export const mockCounties: County[] = [
  {
    id: 'CTY001',
    name: 'Nairobi',
    code: 'NRB',
    units: 15,
    members: 4500,
    coordinates: [-1.2921, 36.8219],
  },
  {
    id: 'CTY002',
    name: 'Mombasa',
    code: 'MBA',
    units: 12,
    members: 3200,
    coordinates: [-4.0435, 39.6682],
  },
  {
    id: 'CTY003',
    name: 'Kisumu',
    code: 'KSM',
    units: 8,
    members: 2100,
    coordinates: [-0.1022, 34.7617],
  },
  {
    id: 'CTY004',
    name: 'Nakuru',
    code: 'NKU',
    units: 10,
    members: 2800,
    coordinates: [-0.3031, 36.0800],
  },
  {
    id: 'CTY005',
    name: 'Uasin Gishu',
    code: 'UGI',
    units: 2,
    members: 800,
    coordinates: [0.5143, 35.2707],
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD001',
    timestamp: '2024-05-12T14:30:00Z',
    user: 'admin@scout.co.ke',
    action: 'UPDATE',
    resource: 'Member',
    resourceId: 'M001',
    status: 'success',
  },
  {
    id: 'AUD002',
    timestamp: '2024-05-12T13:45:00Z',
    user: 'manager@scout.co.ke',
    action: 'CREATE',
    resource: 'Registration',
    resourceId: 'REG001',
    status: 'success',
  },
  {
    id: 'AUD003',
    timestamp: '2024-05-12T12:20:00Z',
    user: 'coordinator@scout.co.ke',
    action: 'DELETE',
    resource: 'Event',
    resourceId: 'EVT001',
    status: 'failure',
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'USR001',
    name: 'Super Admin',
    email: 'admin@scout.co.ke',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01',
    lastLogin: '2024-05-12T15:30:00Z',
  },
  {
    id: 'USR002',
    name: 'County Manager',
    email: 'manager@scout.co.ke',
    role: 'manager',
    status: 'active',
    createdAt: '2023-03-15',
    lastLogin: '2024-05-12T14:00:00Z',
  },
  {
    id: 'USR003',
    name: 'Unit Coordinator',
    email: 'coordinator@scout.co.ke',
    role: 'coordinator',
    status: 'active',
    createdAt: '2023-06-01',
    lastLogin: '2024-05-11T10:30:00Z',
  },
];

// Mock Chart Data
export const mockRegistrationsOverviewData = [
  { name: 'May 4', value: 250 },
  { name: 'May 7', value: 320 },
  { name: 'May 8', value: 290 },
  { name: 'May 9', value: 380 },
  { name: 'May 10', value: 420 },
  { name: 'May 11', value: 450 },
];

export const mockMembersBySectionData = [
  { name: 'Beavers', value: 2450, fill: '#3b82f6' },
  { name: 'Cubs', value: 4320, fill: '#8b5cf6' },
  { name: 'Scouts', value: 8540, fill: '#22c55e' },
  { name: 'Ventures', value: 5230, fill: '#f59e0b' },
  { name: 'Rovers', value: 4218, fill: '#ef4444' },
];

export const mockRevenueBreakdownData = [
  { name: 'Membership Fees', value: 1200000, fill: '#22c55e' },
  { name: 'Event Sponsorship', value: 650000, fill: '#3b82f6' },
  { name: 'Donations', value: 425000, fill: '#8b5cf6' },
  { name: 'Training Programs', value: 200800, fill: '#f59e0b' },
];
