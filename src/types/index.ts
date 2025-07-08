export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'auditor' | 'approval_officer' | 'chairperson' | 'vice_chairperson' | 'treasurer';
  avatar?: string;
  createdAt: string;
}

export interface Member {
  id: string;
  memberNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  savingsBalance: number;
  totalLoans: number;
  avatar?: string;
  organizationRole?: string;
  credibilityScore: number;
  externalIncomes: ExternalIncome[];
  // Additional profile fields
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationalId?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  monthlySavingsFlow: MonthlySavingsFlow[];
}

export interface MonthlySavingsFlow {
  month: string;
  deposits: number;
  withdrawals: number;
  netSavings: number;
  balance: number;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  interestRate: number;
  term: number;
  purpose: string;
  status: 'pending' | 'approved' | 'disbursed' | 'rejected' | 'completed';
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  monthlyPayment: number;
  remainingBalance: number;
  nextPaymentDate?: string;
}

export interface Savings {
  id: string;
  memberId: string;
  memberName: string;
  type: 'monthly_contribution' | 'voluntary_deposit' | 'withdrawal';
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'completed';
}

export interface ExternalIncome {
  id: string;
  memberId: string;
  source: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  category: 'salary' | 'business' | 'investment' | 'rental' | 'pension' | 'freelance' | 'agriculture' | 'other';
  verified: boolean;
  dateAdded: string;
  lastUpdated: string;
  description?: string;
}

export interface SaccoExpense {
  id: string;
  category: 'operational' | 'administrative' | 'marketing' | 'maintenance' | 'utilities' | 'staff' | 'other';
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'paid';
  receiptNumber?: string;
  vendor?: string;
}

export interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  externalIncome: number;
  memberContributions: number;
  loanDisbursements: number;
  loanRepayments: number;
  expenses: number;
}

export interface CredibilityMetrics {
  memberId: string;
  memberName: string;
  score: number;
  factors: {
    paymentHistory: number;
    savingsConsistency: number;
    loanRepaymentRate: number;
    externalIncomeStability: number;
    membershipDuration: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface Approval {
  id: string;
  type: 'membership' | 'loan' | 'withdrawal';
  applicantId: string;
  applicantName: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  level: number;
  maxLevel: number;
  description: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'loans' | 'savings' | 'members' | 'arrears' | 'financial' | 'cashflow' | 'credibility' | 'expenses' | 'profile';
  generatedDate: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv' | 'word' | 'json';
  status: 'generating' | 'ready' | 'error';
  downloadUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  monthlySavings: { month: string; amount: number; members: number }[];
  monthlyExternalIncome: { month: string; amount: number; sources: number }[];
  monthlyExpenses: { month: string; amount: number; categories: number }[];
  savingsVsIncome: { month: string; savings: number; income: number; expenses: number }[];
}