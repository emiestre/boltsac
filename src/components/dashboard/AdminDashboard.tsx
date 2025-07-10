import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { StatsCard } from './StatsCard';
import { MembersTable } from './MembersTable';
import { LoansTable } from './LoansTable';
import { ApprovalsTable } from './ApprovalsTable';
import { RecentActivity } from './RecentActivity';
import { CashFlowChart } from './CashFlowChart';
import { CredibilityChart } from './CredibilityChart';
import { AnalyticsChart } from './AnalyticsChart';
import { OtherIncomeTable } from './OtherIncomeTable';
import { ApprovalDetailsModal } from '../modals/ApprovalDetailsModal';
import { ApprovalConfigModal } from '../modals/ApprovalConfigModal';
import { MemberRegistrationForm } from '../forms/MemberRegistrationForm';
import { LoanApplicationForm } from '../forms/LoanApplicationForm';
import { ExpenseForm } from '../forms/ExpenseForm';
import { MemberProfile } from '../MemberProfile';
import { MemberEditForm } from '../forms/MemberEditForm';
import { Users, DollarSign, TrendingUp, UserCheck, Banknote, FileText, Plus, BarChart3, Star, Receipt, Settings, Workflow } from 'lucide-react';

export function AdminDashboard() {
  const { members, loans, savings, approvals, cashFlowData, credibilityData, expenses, analyticsData, otherIncomes, approveItem, rejectItem, updateMember, addExpense, addOtherIncome, updateOtherIncome, deleteOtherIncome, verifyOtherIncome, rejectOtherIncome } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showApprovalDetails, setShowApprovalDetails] = useState(false);
  const [showApprovalConfig, setShowApprovalConfig] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberProfile, setShowMemberProfile] = useState(false);
  const [showMemberEdit, setShowMemberEdit] = useState(false);

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const totalSavings = members.reduce((sum, m) => sum + m.savingsBalance, 0);
  const totalExternalIncome = members.reduce((sum, member) => sum + member.externalIncomes.reduce((memberSum, income) => {
    let monthlyAmount = income.amount;
    if (income.frequency === 'quarterly') monthlyAmount = income.amount / 3;
    if (income.frequency === 'annually') monthlyAmount = income.amount / 12;
    if (income.frequency === 'one-time') monthlyAmount = 0;
    return memberSum + monthlyAmount;
  }, 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'loans', label: 'Loans', icon: DollarSign },
    { id: 'approvals', label: 'Approvals', icon: UserCheck },
    { id: 'other-income', label: 'Other Income', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cashflow', label: 'Cash Flow', icon: BarChart3 },
    { id: 'credibility', label: 'Credibility', icon: Star },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'approval-config', label: 'Approval Config', icon: Settings },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const handleMemberSubmit = (data) => {
    setShowMemberForm(false);
  };
  const handleLoanSubmit = (data) => {
    setShowLoanForm(false);
  };
  const handleExpenseSubmit = (data) => {
    addExpense({ ...data, status: 'approved' });
    setShowExpenseForm(false);
  };

  const downloadReport = (type, format) => {
    console.log(`Downloading ${type} report as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p>Manage your SACCO operations</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowMemberForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Member</button>
          <button onClick={() => setShowLoanForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg">New Loan Product</button>
          <button onClick={() => setShowExpenseForm(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Record Expense</button>
          <button onClick={() => setShowApprovalConfig(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg">Config Approvals</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Members" value={totalMembers.toString()} subtitle={`${activeMembers} active`} icon={Users} />
        <StatsCard title="Total Savings" value={`UGX ${(totalSavings / 1e6).toFixed(1)}M`} subtitle="All Members" icon={Banknote} />
        <StatsCard title="External Income" value={`UGX ${(totalExternalIncome / 1e6).toFixed(1)}M`} subtitle="Monthly" icon={TrendingUp} />
        <StatsCard title="Total Expenses" value={`UGX ${(totalExpenses / 1e6).toFixed(1)}M`} subtitle="Operational" icon={Receipt} />
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'overview' && <RecentActivity />}
        {activeTab === 'members' && <MembersTable members={members} />}
        {activeTab === 'loans' && <LoansTable loans={loans} />}
        {activeTab === 'approvals' && <ApprovalsTable approvals={approvals} />}
        {activeTab === 'other-income' && <OtherIncomeTable incomes={otherIncomes} onAdd={addOtherIncome} />}
        {activeTab === 'analytics' && <AnalyticsChart data={analyticsData} period="This Year" />}
        {activeTab === 'cashflow' && <CashFlowChart data={cashFlowData} period="This Month" />}
        {activeTab === 'credibility' && <CredibilityChart data={credibilityData} />}
        {activeTab === 'expenses' && (
          <button onClick={() => setShowExpenseForm(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Record Expense</button>
        )}
        {activeTab === 'approval-config' && (
          <div>
            <h2>Approval Flow Configuration</h2>
          </div>
        )}
        {activeTab === 'reports' && (
          <div>
            {[ 'Member Report', 'Loan Report' ].map(report => (
              <div key={report}>
                {['PDF', 'Excel', 'CSV'].map(format => (
                  <button key={format} onClick={() => downloadReport(report, format)}>{format}</button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {showMemberForm && <MemberRegistrationForm onSubmit={handleMemberSubmit} onCancel={() => setShowMemberForm(false)} />}
      {showLoanForm && <LoanApplicationForm onSubmit={handleLoanSubmit} onCancel={() => setShowLoanForm(false)} />}
      {showExpenseForm && <ExpenseForm onSubmit={handleExpenseSubmit} onCancel={() => setShowExpenseForm(false)} />}
      {showApprovalConfig && <ApprovalConfigModal onClose={() => setShowApprovalConfig(false)} onSave={() => setShowApprovalConfig(false)} />}
    </div>
  );
}
