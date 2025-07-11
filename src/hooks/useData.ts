import { useState, useEffect } from 'react';
import { Member, Loan, Savings, Approval, Report, Notification, ExternalIncome, CashFlowData, CredibilityMetrics, SaccoExpense, AnalyticsData, OtherIncomeEntry, Employee, PayrollRecord } from '../types';

// Mock data with enhanced member profiles
const mockMembers: Member[] = [
  {
    id: '1',
    memberNumber: 'MEM001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+256-700-123456',
    address: '123 Main St, Kampala',
    joinDate: '2024-01-15',
    status: 'active',
    savingsBalance: 2500000,
    totalLoans: 1500000,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    organizationRole: 'treasurer',
    credibilityScore: 85,
    dateOfBirth: '1985-03-15',
    gender: 'male',
    maritalStatus: 'married',
    nationalId: 'CM12345678901234',
    occupation: 'Software Engineer',
    employer: 'Tech Solutions Ltd',
    monthlyIncome: 3000000,
    externalIncomes: [
      {
        id: '1',
        memberId: '1',
        source: 'ABC Company Ltd',
        amount: 3000000,
        frequency: 'monthly',
        category: 'salary',
        verified: true,
        dateAdded: '2024-01-15',
        lastUpdated: '2024-02-01',
        description: 'Monthly salary'
      },
      {
        id: '2',
        memberId: '1',
        source: 'Rental Property',
        amount: 800000,
        frequency: 'monthly',
        category: 'rental',
        verified: true,
        dateAdded: '2024-01-20',
        lastUpdated: '2024-02-01',
        description: 'Apartment rental income'
      }
    ],
    monthlySavingsFlow: [
      { month: 'Jan 2024', deposits: 500000, withdrawals: 0, netSavings: 500000, balance: 2000000 },
      { month: 'Feb 2024', deposits: 750000, withdrawals: 200000, netSavings: 550000, balance: 2550000 },
    ]
  },
  {
    id: '2',
    memberNumber: 'MEM002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+256-700-987654',
    address: '456 Oak Ave, Entebbe',
    joinDate: '2024-02-20',
    status: 'pending',
    savingsBalance: 800000,
    totalLoans: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b30e4c53?w=100&h=100&fit=crop&crop=face',
    organizationRole: 'member',
    credibilityScore: 72,
    dateOfBirth: '1990-07-22',
    gender: 'female',
    maritalStatus: 'single',
    nationalId: 'CF98765432109876',
    occupation: 'Graphic Designer',
    employer: 'Creative Agency',
    monthlyIncome: 1500000,
    externalIncomes: [
      {
        id: '3',
        memberId: '2',
        source: 'Freelance Design',
        amount: 1500000,
        frequency: 'monthly',
        category: 'freelance',
        verified: false,
        dateAdded: '2024-02-20',
        lastUpdated: '2024-02-20',
        description: 'Graphic design services'
      }
    ],
    monthlySavingsFlow: [
      { month: 'Feb 2024', deposits: 300000, withdrawals: 0, netSavings: 300000, balance: 800000 },
    ]
  },
  {
    id: '3',
    memberNumber: 'MEM003',
    name: 'Peter Johnson',
    email: 'peter@example.com',
    phone: '+256-700-555123',
    address: '789 Pine St, Jinja',
    joinDate: '2023-12-10',
    status: 'active',
    savingsBalance: 4200000,
    totalLoans: 3000000,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    organizationRole: 'committee_member',
    credibilityScore: 91,
    dateOfBirth: '1978-11-05',
    gender: 'male',
    maritalStatus: 'married',
    nationalId: 'CM11223344556677',
    occupation: 'Business Owner',
    employer: 'Johnson Enterprises',
    monthlyIncome: 5000000,
    externalIncomes: [
      {
        id: '4',
        memberId: '3',
        source: 'Johnson Enterprises',
        amount: 5000000,
        frequency: 'monthly',
        category: 'business',
        verified: true,
        dateAdded: '2023-12-10',
        lastUpdated: '2024-02-01',
        description: 'Business profits'
      }
    ],
    monthlySavingsFlow: [
      { month: 'Dec 2023', deposits: 800000, withdrawals: 0, netSavings: 800000, balance: 3400000 },
      { month: 'Jan 2024', deposits: 800000, withdrawals: 0, netSavings: 800000, balance: 4200000 },
    ]
  },
  {
    id: '4',
    memberNumber: 'MEM004',
    name: 'Mary Wilson',
    email: 'mary@example.com',
    phone: '+256-700-444789',
    address: '321 Cedar Ave, Mbarara',
    joinDate: '2024-01-05',
    status: 'active',
    savingsBalance: 1800000,
    totalLoans: 1000000,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    organizationRole: 'secretary',
    credibilityScore: 78,
    dateOfBirth: '1982-04-18',
    gender: 'female',
    maritalStatus: 'married',
    nationalId: 'CF55667788990011',
    occupation: 'Teacher',
    employer: 'Mbarara Primary School',
    monthlyIncome: 2200000,
    externalIncomes: [
      {
        id: '5',
        memberId: '4',
        source: 'Teaching Salary',
        amount: 2200000,
        frequency: 'monthly',
        category: 'salary',
        verified: true,
        dateAdded: '2024-01-05',
        lastUpdated: '2024-02-01',
        description: 'Primary school teacher'
      }
    ],
    monthlySavingsFlow: [
      { month: 'Jan 2024', deposits: 400000, withdrawals: 0, netSavings: 400000, balance: 1400000 },
      { month: 'Feb 2024', deposits: 400000, withdrawals: 0, netSavings: 400000, balance: 1800000 },
    ]
  },
  {
    id: '5',
    memberNumber: 'MEM005',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+256-700-333456',
    address: '654 Elm St, Gulu',
    joinDate: '2023-11-20',
    status: 'active',
    savingsBalance: 3100000,
    totalLoans: 2500000,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    organizationRole: 'loan_officer',
    credibilityScore: 88,
    dateOfBirth: '1975-09-12',
    gender: 'male',
    maritalStatus: 'married',
    nationalId: 'CM99887766554433',
    occupation: 'Farmer',
    employer: 'Self Employed',
    monthlyIncome: 1800000,
    externalIncomes: [
      {
        id: '6',
        memberId: '5',
        source: 'Agricultural Sales',
        amount: 1800000,
        frequency: 'quarterly',
        category: 'agriculture',
        verified: true,
        dateAdded: '2023-11-20',
        lastUpdated: '2024-02-01',
        description: 'Coffee and maize sales'
      }
    ],
    monthlySavingsFlow: [
      { month: 'Nov 2023', deposits: 600000, withdrawals: 0, netSavings: 600000, balance: 2500000 },
      { month: 'Dec 2023', deposits: 600000, withdrawals: 0, netSavings: 600000, balance: 3100000 },
    ]
  }
];

const mockOtherIncomes: OtherIncomeEntry[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'John Doe',
    source: 'ABC Company Ltd',
    amount: 3000000,
    frequency: 'monthly',
    category: 'salary',
    verified: true,
    dateAdded: '2024-01-15',
    lastUpdated: '2024-02-01',
    description: 'Monthly salary from tech company',
    status: 'verified',
    verifiedBy: 'Admin User',
    verificationDate: '2024-01-16'
  },
  {
    id: '2',
    memberId: '1',
    memberName: 'John Doe',
    source: 'Rental Property',
    amount: 800000,
    frequency: 'monthly',
    category: 'rental',
    verified: true,
    dateAdded: '2024-01-20',
    lastUpdated: '2024-02-01',
    description: 'Apartment rental income',
    status: 'verified',
    verifiedBy: 'Admin User',
    verificationDate: '2024-01-21'
  },
  {
    id: '3',
    memberId: '2',
    memberName: 'Jane Smith',
    source: 'Freelance Design',
    amount: 1500000,
    frequency: 'monthly',
    category: 'freelance',
    verified: false,
    dateAdded: '2024-02-20',
    lastUpdated: '2024-02-20',
    description: 'Graphic design services',
    status: 'pending'
  },
  {
    id: '4',
    memberId: '3',
    memberName: 'Peter Johnson',
    source: 'Johnson Enterprises',
    amount: 5000000,
    frequency: 'monthly',
    category: 'business',
    verified: true,
    dateAdded: '2023-12-10',
    lastUpdated: '2024-02-01',
    description: 'Business profits from enterprise',
    status: 'verified',
    verifiedBy: 'Treasurer',
    verificationDate: '2023-12-11'
  },
  {
    id: '5',
    memberId: '4',
    memberName: 'Mary Wilson',
    source: 'Teaching Salary',
    amount: 2200000,
    frequency: 'monthly',
    category: 'salary',
    verified: true,
    dateAdded: '2024-01-05',
    lastUpdated: '2024-02-01',
    description: 'Primary school teacher salary',
    status: 'verified',
    verifiedBy: 'Secretary',
    verificationDate: '2024-01-06'
  },
  {
    id: '6',
    memberId: '5',
    memberName: 'David Brown',
    source: 'Agricultural Sales',
    amount: 1800000,
    frequency: 'quarterly',
    category: 'agriculture',
    verified: true,
    dateAdded: '2023-11-20',
    lastUpdated: '2024-02-01',
    description: 'Coffee and maize sales',
    status: 'verified',
    verifiedBy: 'Loan Officer',
    verificationDate: '2023-11-21'
  }
];

const mockExpenses: SaccoExpense[] = [
  {
    id: '1',
    category: 'operational',
    description: 'Office rent for February 2024',
    amount: 1200000,
    date: '2024-02-01',
    approvedBy: 'treasurer',
    status: 'paid',
    receiptNumber: 'REC001',
    vendor: 'Property Management Ltd'
  },
  {
    id: '2',
    category: 'utilities',
    description: 'Electricity and water bills',
    amount: 350000,
    date: '2024-02-15',
    approvedBy: 'admin',
    status: 'paid',
    receiptNumber: 'REC002',
    vendor: 'UMEME & NWSC'
  },
  {
    id: '3',
    category: 'staff',
    description: 'Staff salaries for February',
    amount: 2500000,
    date: '2024-02-28',
    approvedBy: 'chairperson',
    status: 'paid',
    receiptNumber: 'REC003'
  }
];

const mockAnalyticsData: AnalyticsData = {
  monthlySavings: [
    { month: 'Oct 2023', amount: 8500000, members: 45 },
    { month: 'Nov 2023', amount: 9200000, members: 48 },
    { month: 'Dec 2023', amount: 10100000, members: 52 },
    { month: 'Jan 2024', amount: 11500000, members: 55 },
    { month: 'Feb 2024', amount: 12800000, members: 58 },
  ],
  monthlyExternalIncome: [
    { month: 'Oct 2023', amount: 15200000, sources: 85 },
    { month: 'Nov 2023', amount: 16800000, sources: 92 },
    { month: 'Dec 2023', amount: 18500000, sources: 98 },
    { month: 'Jan 2024', amount: 19200000, sources: 105 },
    { month: 'Feb 2024', amount: 21000000, sources: 112 },
  ],
  monthlyExpenses: [
    { month: 'Oct 2023', amount: 3200000, categories: 6 },
    { month: 'Nov 2023', amount: 3800000, categories: 7 },
    { month: 'Dec 2023', amount: 4200000, categories: 8 },
    { month: 'Jan 2024', amount: 3900000, categories: 6 },
    { month: 'Feb 2024', amount: 4050000, categories: 7 },
  ],
  savingsVsIncome: [
    { month: 'Oct', savings: 8500000, income: 15200000, expenses: 3200000 },
    { month: 'Nov', savings: 9200000, income: 16800000, expenses: 3800000 },
    { month: 'Dec', savings: 10100000, income: 18500000, expenses: 4200000 },
    { month: 'Jan', savings: 11500000, income: 19200000, expenses: 3900000 },
    { month: 'Feb', savings: 12800000, income: 21000000, expenses: 4050000 },
  ]
};

const mockLoans: Loan[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'John Doe',
    amount: 5000000,
    interestRate: 12,
    term: 24,
    purpose: 'Business expansion',
    status: 'disbursed',
    appliedDate: '2024-01-20',
    approvedDate: '2024-01-25',
    disbursedDate: '2024-01-30',
    monthlyPayment: 235000,
    remainingBalance: 3500000,
    nextPaymentDate: '2024-03-01'
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'Jane Smith',
    amount: 2000000,
    interestRate: 10,
    term: 12,
    purpose: 'Home improvement',
    status: 'pending',
    appliedDate: '2024-02-15',
    monthlyPayment: 175000,
    remainingBalance: 2000000
  }
];

const mockSavings: Savings[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'John Doe',
    type: 'monthly_contribution',
    amount: 500000,
    date: '2024-02-01',
    description: 'Monthly savings contribution',
    status: 'completed'
  },
  {
    id: '2',
    memberId: '1',
    memberName: 'John Doe',
    type: 'voluntary_deposit',
    amount: 1000000,
    date: '2024-02-15',
    description: 'Extra savings deposit',
    status: 'completed'
  }
];

const mockApprovals: Approval[] = [
  {
    id: '1',
    type: 'membership',
    applicantId: '2',
    applicantName: 'Jane Smith',
    status: 'pending',
    submittedDate: '2024-02-20',
    level: 1,
    maxLevel: 3,
    description: 'New membership application',
    approvalFlow: [
      {
        level: 1,
        approverRole: 'secretary',
        approverName: 'Mary Wilson',
        required: true,
        status: 'pending'
      },
      {
        level: 2,
        approverRole: 'treasurer',
        approverName: 'John Doe',
        required: true,
        status: 'pending'
      },
      {
        level: 3,
        approverRole: 'chairperson',
        approverName: 'Peter Johnson',
        required: true,
        status: 'pending'
      }
    ],
    history: []
  },
  {
    id: '2',
    type: 'loan',
    applicantId: '2',
    applicantName: 'Jane Smith',
    amount: 2000000,
    status: 'pending',
    submittedDate: '2024-02-15',
    level: 2,
    maxLevel: 3,
    description: 'Home improvement loan',
    approvalFlow: [
      {
        level: 1,
        approverRole: 'loan_officer',
        approverName: 'David Brown',
        required: true,
        status: 'approved',
        processedDate: '2024-02-16',
        remarks: 'Documentation complete, good credit history'
      },
      {
        level: 2,
        approverRole: 'treasurer',
        approverName: 'John Doe',
        required: true,
        status: 'pending'
      },
      {
        level: 3,
        approverRole: 'chairperson',
        approverName: 'Peter Johnson',
        required: true,
        status: 'pending'
      }
    ],
    history: [
      {
        level: 1,
        approverName: 'David Brown',
        action: 'approved',
        date: '2024-02-16',
        remarks: 'Documentation complete, good credit history'
      }
    ]
  }
];

const mockCashFlowData: CashFlowData[] = [
  {
    date: '2024-01-01',
    inflow: 15000000,
    outflow: 8000000,
    netFlow: 7000000,
    externalIncome: 5000000,
    memberContributions: 8000000,
    loanDisbursements: 6000000,
    loanRepayments: 2000000,
    expenses: 2000000
  },
  {
    date: '2024-01-08',
    inflow: 18000000,
    outflow: 12000000,
    netFlow: 6000000,
    externalIncome: 6000000,
    memberContributions: 10000000,
    loanDisbursements: 10000000,
    loanRepayments: 2000000,
    expenses: 2000000
  },
  {
    date: '2024-01-15',
    inflow: 22000000,
    outflow: 15000000,
    netFlow: 7000000,
    externalIncome: 8000000,
    memberContributions: 12000000,
    loanDisbursements: 12000000,
    loanRepayments: 2000000,
    expenses: 3000000
  },
  {
    date: '2024-01-22',
    inflow: 20000000,
    outflow: 10000000,
    netFlow: 10000000,
    externalIncome: 7000000,
    memberContributions: 11000000,
    loanDisbursements: 8000000,
    loanRepayments: 2000000,
    expenses: 2000000
  },
  {
    date: '2024-01-29',
    inflow: 25000000,
    outflow: 18000000,
    netFlow: 7000000,
    externalIncome: 9000000,
    memberContributions: 14000000,
    loanDisbursements: 15000000,
    loanRepayments: 2000000,
    expenses: 3000000
  }
];

const mockCredibilityData: CredibilityMetrics[] = [
  {
    memberId: '3',
    memberName: 'Peter Johnson',
    score: 91,
    factors: {
      paymentHistory: 95,
      savingsConsistency: 88,
      loanRepaymentRate: 92,
      externalIncomeStability: 90,
      membershipDuration: 85
    },
    trend: 'improving',
    lastUpdated: '2024-02-28'
  },
  {
    memberId: '5',
    memberName: 'David Brown',
    score: 88,
    factors: {
      paymentHistory: 90,
      savingsConsistency: 85,
      loanRepaymentRate: 88,
      externalIncomeStability: 92,
      membershipDuration: 90
    },
    trend: 'stable',
    lastUpdated: '2024-02-28'
  },
  {
    memberId: '1',
    memberName: 'John Doe',
    score: 85,
    factors: {
      paymentHistory: 88,
      savingsConsistency: 82,
      loanRepaymentRate: 85,
      externalIncomeStability: 88,
      membershipDuration: 80
    },
    trend: 'improving',
    lastUpdated: '2024-02-28'
  },
  {
    memberId: '4',
    memberName: 'Mary Wilson',
    score: 78,
    factors: {
      paymentHistory: 80,
      savingsConsistency: 75,
      loanRepaymentRate: 82,
      externalIncomeStability: 78,
      membershipDuration: 75
    },
    trend: 'stable',
    lastUpdated: '2024-02-28'
  },
  {
    memberId: '2',
    memberName: 'Jane Smith',
    score: 72,
    factors: {
      paymentHistory: 70,
      savingsConsistency: 68,
      loanRepaymentRate: 75,
      externalIncomeStability: 70,
      membershipDuration: 65
    },
    trend: 'improving',
    lastUpdated: '2024-02-28'
  }
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeNumber: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@sacco.com',
    phone: '+256-700-111222',
    address: '123 Admin Street, Kampala',
    dateOfBirth: '1985-06-15',
    gender: 'female',
    maritalStatus: 'married',
    nationalId: 'CM85061512345678',
    position: 'General Manager',
    department: 'Management',
    employmentType: 'full_time',
    startDate: '2020-01-15',
    status: 'active',
    basicSalary: 4500000,
    allowances: [],
    deductions: [],
    payrollFrequency: 'monthly',
    emergencyContact: {
      name: 'John Johnson',
      phone: '+256-700-333444',
      relationship: 'spouse'
    },
    systemRole: 'admin',
    permissions: ['all'],
    documents: [],
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2',
    employeeNumber: 'EMP002',
    firstName: 'Michael',
    lastName: 'Ochieng',
    email: 'michael.ochieng@sacco.com',
    phone: '+256-700-555666',
    address: '456 Finance Avenue, Kampala',
    dateOfBirth: '1988-03-22',
    gender: 'male',
    maritalStatus: 'single',
    nationalId: 'CM88032287654321',
    position: 'Finance Officer',
    department: 'Finance',
    employmentType: 'full_time',
    startDate: '2021-03-01',
    status: 'active',
    basicSalary: 3200000,
    allowances: [],
    deductions: [],
    payrollFrequency: 'monthly',
    emergencyContact: {
      name: 'Grace Ochieng',
      phone: '+256-700-777888',
      relationship: 'mother'
    },
    systemRole: 'treasurer',
    permissions: ['finance', 'reports'],
    documents: [],
    createdAt: '2021-03-01T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '3',
    employeeNumber: 'EMP003',
    firstName: 'Grace',
    lastName: 'Nakato',
    email: 'grace.nakato@sacco.com',
    phone: '+256-700-999000',
    address: '789 Operations Road, Kampala',
    dateOfBirth: '1990-11-08',
    gender: 'female',
    maritalStatus: 'married',
    nationalId: 'CF90110811223344',
    position: 'Operations Assistant',
    department: 'Operations',
    employmentType: 'full_time',
    startDate: '2022-06-15',
    status: 'active',
    basicSalary: 2800000,
    allowances: [],
    deductions: [],
    payrollFrequency: 'monthly',
    emergencyContact: {
      name: 'Paul Nakato',
      phone: '+256-700-111333',
      relationship: 'spouse'
    },
    permissions: ['operations', 'members'],
    documents: [],
    createdAt: '2022-06-15T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    createdBy: 'admin'
  }
];

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    period: 'February 2024',
    basicSalary: 4500000,
    totalAllowances: 500000,
    totalDeductions: 750000,
    grossPay: 5000000,
    netPay: 4250000,
    status: 'paid',
    generatedAt: '2024-02-28T00:00:00Z',
    approvedBy: 'Board',
    paidAt: '2024-02-28T00:00:00Z'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Michael Ochieng',
    period: 'February 2024',
    basicSalary: 3200000,
    totalAllowances: 300000,
    totalDeductions: 525000,
    grossPay: 3500000,
    netPay: 2975000,
    status: 'approved',
    generatedAt: '2024-02-28T00:00:00Z',
    approvedBy: 'Sarah Johnson'
  }
];

export function useData() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [savings, setSavings] = useState<Savings[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([]);
  const [credibilityData, setCredibilityData] = useState<CredibilityMetrics[]>([]);
  const [expenses, setExpenses] = useState<SaccoExpense[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData);
  const [otherIncomes, setOtherIncomes] = useState<OtherIncomeEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMembers(mockMembers);
      setLoans(mockLoans);
      setSavings(mockSavings);
      setApprovals(mockApprovals);
      setReports([]);
      setNotifications([]);
      setCashFlowData(mockCashFlowData);
      setCredibilityData(mockCredibilityData);
      setExpenses(mockExpenses);
      setOtherIncomes(mockOtherIncomes);
      setEmployees(mockEmployees);
      setPayrollRecords(mockPayrollRecords);
    }, 1000);
  }, []);

  const approveItem = (id: string, type: string) => {
    if (type === 'membership') {
      setMembers(prev => prev.map(member => 
        member.id === id ? { ...member, status: 'active' } : member
      ));
    } else if (type === 'loan') {
      setLoans(prev => prev.map(loan => 
        loan.id === id ? { ...loan, status: 'approved', approvedDate: new Date().toISOString() } : loan
      ));
    }
    setApprovals(prev => prev.map(approval => 
      approval.id === id ? { ...approval, status: 'approved', approvedDate: new Date().toISOString() } : approval
    ));
  };

  const rejectItem = (id: string, type: string) => {
    if (type === 'loan') {
      setLoans(prev => prev.map(loan => 
        loan.id === id ? { ...loan, status: 'rejected' } : loan
      ));
    }
    setApprovals(prev => prev.map(approval => 
      approval.id === id ? { ...approval, status: 'rejected' } : approval
    ));
  };

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...data } : member
    ));
  };

  const addExpense = (expenseData: Omit<SaccoExpense, 'id'>) => {
    const newExpense: SaccoExpense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const addOtherIncome = (incomeData: Omit<OtherIncomeEntry, 'id'>) => {
    const newIncome: OtherIncomeEntry = {
      ...incomeData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setOtherIncomes(prev => [...prev, newIncome]);
  };

  const updateOtherIncome = (id: string, data: Partial<OtherIncomeEntry>) => {
    setOtherIncomes(prev => prev.map(income => 
      income.id === id ? { ...income, ...data } : income
    ));
  };

  const deleteOtherIncome = (id: string) => {
    setOtherIncomes(prev => prev.filter(income => income.id !== id));
  };

  const verifyOtherIncome = (id: string) => {
    setOtherIncomes(prev => prev.map(income => 
      income.id === id ? { 
        ...income, 
        status: 'verified', 
        verified: true,
        verifiedBy: 'Current User',
        verificationDate: new Date().toISOString()
      } : income
    ));
  };

  const rejectOtherIncome = (id: string, reason: string) => {
    setOtherIncomes(prev => prev.map(income => 
      income.id === id ? { 
        ...income, 
        status: 'rejected', 
        verified: false,
        description: `${income.description || ''} [Rejected: ${reason}]`
      } : income
    ));
  };

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(employee => 
      employee.id === id ? { ...employee, ...data, updatedAt: new Date().toISOString() } : employee
    ));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(employee => employee.id !== id));
  };

  const generatePayroll = (period: string) => {
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    const newPayrollRecords = activeEmployees.map(employee => ({
      id: Math.random().toString(36).substr(2, 9),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      period: period,
      basicSalary: employee.basicSalary,
      totalAllowances: employee.allowances.reduce((sum, allowance) => sum + allowance.amount, 0),
      totalDeductions: employee.deductions.reduce((sum, deduction) => sum + deduction.amount, 0),
      grossPay: employee.basicSalary + employee.allowances.reduce((sum, allowance) => sum + allowance.amount, 0),
      netPay: employee.basicSalary + employee.allowances.reduce((sum, allowance) => sum + allowance.amount, 0) - employee.deductions.reduce((sum, deduction) => sum + deduction.amount, 0),
      status: 'draft' as const,
      generatedAt: new Date().toISOString()
    }));
    
    setPayrollRecords(prev => [...prev, ...newPayrollRecords]);
  };

  return {
    members,
    loans,
    savings,
    approvals,
    reports,
    notifications,
    cashFlowData,
    credibilityData,
    expenses,
    analyticsData,
    otherIncomes,
    employees,
    payrollRecords,
    approveItem,
    rejectItem,
    updateMember,
    addExpense,
    addOtherIncome,
    updateOtherIncome,
    deleteOtherIncome,
    verifyOtherIncome,
    rejectOtherIncome,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    generatePayroll
  };
}