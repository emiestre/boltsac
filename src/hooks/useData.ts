import { useState, useEffect } from 'react';
import { Member, Loan, Savings, Approval, Report, Notification, ExternalIncome, CashFlowData, CredibilityMetrics, SaccoExpense, AnalyticsData } from '../types';

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
    description: 'New membership application'
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
    description: 'Home improvement loan'
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
    approveItem,
    rejectItem,
    updateMember,
    addExpense
  };
}