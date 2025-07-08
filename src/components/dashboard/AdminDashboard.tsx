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
import { MemberRegistrationForm } from '../forms/MemberRegistrationForm';
import { LoanApplicationForm } from '../forms/LoanApplicationForm';
import { ExpenseForm } from '../forms/ExpenseForm';
import { MemberProfile } from '../MemberProfile';
import { MemberEditForm } from '../forms/MemberEditForm';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  UserCheck,
  Banknote,
  Calculator,
  FileText,
  Plus,
  BarChart3,
  Star,
  Receipt
} from 'lucide-react';

export function AdminDashboard() {
  const { members, loans, savings, approvals, cashFlowData, credibilityData, expenses, analyticsData, approveItem, rejectItem, updateMember, addExpense } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMemberProfile, setShowMemberProfile] = useState(false);
  const [showMemberEdit, setShowMemberEdit] = useState(false);

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const totalSavings = members.reduce((sum, m) => sum + m.savingsBalance, 0);
  const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);
  const activeLoans = loans.filter(l => l.status === 'disbursed').length;
  const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
  
  // Calculate external income totals
  const totalExternalIncome = members.reduce((sum, member) => {
    return sum + member.externalIncomes.reduce((memberSum, income) => {
      let monthlyAmount = income.amount;
      if (income.frequency === 'quarterly') monthlyAmount = income.amount / 3;
      if (income.frequency === 'annually') monthlyAmount = income.amount / 12;
      if (income.frequency === 'one-time') monthlyAmount = 0;
      return memberSum + monthlyAmount;
    }, 0);
  }, 0);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageCredibilityScore = credibilityData.reduce((sum, member) => sum + member.score, 0) / credibilityData.length || 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'loans', label: 'Loans', icon: DollarSign },
    { id: 'approvals', label: 'Approvals', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cashflow', label: 'Cash Flow', icon: BarChart3 },
    { id: 'credibility', label: 'Credibility', icon: Star },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const handleMemberSubmit = (data: any) => {
    console.log('New member registration:', data);
    setShowMemberForm(false);
    // Here you would typically send the data to your backend
  };

  const handleLoanSubmit = (data: any) => {
    console.log('New loan application:', data);
    setShowLoanForm(false);
    // Here you would typically send the data to your backend
  };

  const handleExpenseSubmit = (data: any) => {
    addExpense({
      ...data,
      status: 'approved' as const
    });
    setShowExpenseForm(false);
  };

  const handleMemberEdit = (data: any) => {
    if (selectedMember) {
      updateMember(selectedMember.id, data);
      setShowMemberEdit(false);
      setSelectedMember(null);
    }
  };

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setShowMemberProfile(true);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowMemberEdit(true);
  };

  const downloadReport = (type: string, format: string) => {
    console.log(`Downloading ${type} report as ${format}`);
    // Mock download functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your SACCO operations</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowMemberForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
          <button 
            onClick={() => setShowLoanForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Loan Product</span>
          </button>
          <button 
            onClick={() => setShowExpenseForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={totalMembers.toString()}
          subtitle={`${activeMembers} active, ${pendingMembers} pending`}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total Savings"
          value={`UGX ${(totalSavings / 1000000).toFixed(1)}M`}
          subtitle="Across all members"
          icon={Banknote}
          color="green"
        />
        <StatsCard
          title="External Income"
          value={`UGX ${(totalExternalIncome / 1000000).toFixed(1)}M`}
          subtitle="Monthly from external sources"
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Total Expenses"
          value={`UGX ${(totalExpenses / 1000000).toFixed(1)}M`}
          subtitle="SACCO operational costs"
          icon={Receipt}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'overview' && (
          <>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <RecentActivity />
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                    <div className="font-medium text-gray-900">Review Pending Loans</div>
                    <div className="text-sm text-gray-500">{loans.filter(l => l.status === 'pending').length} pending</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                    <div className="font-medium text-gray-900">Approve Memberships</div>
                    <div className="text-sm text-gray-500">{pendingMembers} pending</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                    <div className="font-medium text-gray-900">Generate Reports</div>
                    <div className="text-sm text-gray-500">Monthly statements</div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'members' && (
          <div className="lg:col-span-3">
            <MembersTable 
              members={members} 
              onViewMember={handleViewMember}
              onEditMember={handleEditMember}
            />
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="lg:col-span-3">
            <LoansTable loans={loans} />
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="lg:col-span-3">
            <ApprovalsTable 
              approvals={approvals} 
              onApprove={approveItem}
              onReject={rejectItem}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="lg:col-span-3">
            <AnalyticsChart data={analyticsData} period="This Year" />
          </div>
        )}

        {activeTab === 'cashflow' && (
          <div className="lg:col-span-3">
            <CashFlowChart data={cashFlowData} period="This Month" />
          </div>
        )}

        {activeTab === 'credibility' && (
          <div className="lg:col-span-3">
            <CredibilityChart data={credibilityData} />
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">SACCO Expenses</h2>
                  <button 
                    onClick={() => setShowExpenseForm(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Record Expense
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          UGX {expense.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            expense.status === 'paid' ? 'bg-green-100 text-green-800' :
                            expense.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Member Report', 
                  'Loan Report', 
                  'Savings Report', 
                  'Arrears Report', 
                  'Financial Statement', 
                  'Cash Flow Report',
                  'Credibility Report',
                  'External Income Report',
                  'Expense Report',
                  'Audit Trail'
                ].map((report) => (
                  <div key={report} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-medium text-gray-900 mb-2">{report}</div>
                    <div className="flex space-x-2">
                      {['PDF', 'Excel', 'CSV'].map((format) => (
                        <button
                          key={format}
                          onClick={() => downloadReport(report, format)}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forms and Modals */}
      {showMemberForm && (
        <MemberRegistrationForm
          onSubmit={handleMemberSubmit}
          onCancel={() => setShowMemberForm(false)}
        />
      )}

      {showLoanForm && (
        <LoanApplicationForm
          onSubmit={handleLoanSubmit}
          onCancel={() => setShowLoanForm(false)}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm
          onSubmit={handleExpenseSubmit}
          onCancel={() => setShowExpenseForm(false)}
        />
      )}

      {showMemberProfile && selectedMember && (
        <MemberProfile
          member={selectedMember}
          onClose={() => {
            setShowMemberProfile(false);
            setSelectedMember(null);
          }}
          onEdit={() => {
            setShowMemberProfile(false);
            setShowMemberEdit(true);
          }}
          canEdit={true}
        />
      )}

      {showMemberEdit && selectedMember && (
        <MemberEditForm
          member={selectedMember}
          onSubmit={handleMemberEdit}
          onCancel={() => {
            setShowMemberEdit(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
}