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
  Receipt,
  Settings,
  Workflow
} from 'lucide-react';

export function AdminDashboard() {
  const { members, loans, savings, approvals, cashFlowData, credibilityData, expenses, analyticsData, otherIncomes, approveItem, rejectItem, updateMember, addExpense, addOtherIncome, updateOtherIncome, deleteOtherIncome, verifyOtherIncome, rejectOtherIncome } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showApprovalDetails, setShowApprovalDetails] = useState(false);
  const [showApprovalConfig, setShowApprovalConfig] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
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
    { id: 'other-income', label: 'Other Income', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cashflow', label: 'Cash Flow', icon: BarChart3 },
    { id: 'credibility', label: 'Credibility', icon: Star },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'approval-config', label: 'Approval Config', icon: Settings },
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

  const handleViewApprovalDetails = (approval: any) => {
    setSelectedApproval(approval);
    setShowApprovalDetails(true);
  };

  const handleAddRemark = (approval: any) => {
    setSelectedApproval(approval);
    setShowApprovalDetails(true);
  };

  const handleApprovalAction = (id: string, action: string, remarks?: string) => {
    if (action === 'approve') {
      approveItem(id, selectedApproval?.type);
    } else if (action === 'reject') {
      rejectItem(id, selectedApproval?.type);
    }
    setShowApprovalDetails(false);
    setSelectedApproval(null);
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
          <button 
            onClick={() => setShowApprovalConfig(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Config Approvals</span>
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
                    onClick={() => setActiveTab('approvals')}
                    onClick={() => setShowExpenseForm(true)}
                    onClick={() => setActiveTab('approvals')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Record Expense
                  </button>
                </div>
                    onClick={() => setActiveTab('reports')}
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
              onViewDetails={handleViewApprovalDetails}
              onAddRemark={handleAddRemark}
            </div>
          </div>
        )}

        {activeTab === 'other-income' && (
          <div className="lg:col-span-3">
            <OtherIncomeTable
              incomes={otherIncomes || []}
              onAdd={addOtherIncome}
              onEdit={updateOtherIncome}
              onDelete={deleteOtherIncome}
              onVerify={verifyOtherIncome}
              onReject={rejectOtherIncome}
              canEdit={true}
            />
          </div>
        {activeTab === 'approval-config' && (
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Approval Flow Configuration</h2>
                  <p className="text-gray-600">Configure approval workflows for different request types</p>
                </div>
                <button 
                  onClick={() => setShowApprovalConfig(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Workflow</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['membership', 'loan', 'withdrawal'].map((type) => (
                  <div key={type} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Workflow className="w-5 h-5 text-purple-600" />
                      <h3 className="font-medium text-gray-900 capitalize">{type} Approval</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Steps:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg. Time:</span>
                        <span className="font-medium">2.5 days</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowApprovalConfig(true)}
                      className="w-full mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Configure →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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

      {showApprovalDetails && selectedApproval && (
        <ApprovalDetailsModal
          approval={selectedApproval}
          onClose={() => {
            setShowApprovalDetails(false);
            setSelectedApproval(null);
          }}
          onApprove={(id, remarks) => handleApprovalAction(id, 'approve', remarks)}
          onReject={(id, remarks) => handleApprovalAction(id, 'reject', remarks)}
          onForward={(id, remarks) => handleApprovalAction(id, 'forward', remarks)}
        />
      )}

      {showApprovalConfig && (
        <ApprovalConfigModal
          onClose={() => setShowApprovalConfig(false)}
          onSave={(config) => {
            console.log('Approval config saved:', config);
            setShowApprovalConfig(false);
          }}
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