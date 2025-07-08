import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { StatsCard } from './StatsCard';
import { LoanApplicationForm } from '../forms/LoanApplicationForm';
import { SavingsDepositForm } from '../forms/SavingsDepositForm';
import { WithdrawalRequestForm } from '../forms/WithdrawalRequestForm';
import { StatementDownloadModal } from '../modals/StatementDownloadModal';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Calendar,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function MemberDashboard() {
  const { loans, savings } = useData();
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);

  // Mock member data - in a real app, this would come from the current user's data
  const memberData = {
    savingsBalance: 2500000,
    totalLoans: 1,
    activeLoans: 1,
    monthlyContribution: 500000,
    nextPaymentDate: '2024-03-01',
    nextPaymentAmount: 235000
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'deposit',
      description: 'Monthly savings contribution',
      amount: 500000,
      date: '2024-02-01',
      status: 'completed'
    },
    {
      id: 2,
      type: 'withdrawal',
      description: 'Loan payment',
      amount: -235000,
      date: '2024-02-01',
      status: 'completed'
    },
    {
      id: 3,
      type: 'deposit',
      description: 'Voluntary savings',
      amount: 1000000,
      date: '2024-01-15',
      status: 'completed'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleLoanSubmit = (data: any) => {
    console.log('Loan application submitted:', data);
    setShowLoanForm(false);
    // Here you would typically send the data to your backend
  };

  const handleDepositSubmit = (data: any) => {
    console.log('Deposit submitted:', data);
    setShowDepositForm(false);
    // Here you would typically process the deposit
  };

  const handleWithdrawalSubmit = (data: any) => {
    console.log('Withdrawal request submitted:', data);
    setShowWithdrawalForm(false);
    // Here you would typically process the withdrawal request
  };

  const handleStatementDownload = (data: any) => {
    console.log('Statement download requested:', data);
    setShowStatementModal(false);
    // Here you would typically generate and download the statement
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
          <p className="text-gray-600">Welcome back, John Doe</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowLoanForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Loan</span>
          </button>
          <button 
            onClick={() => setShowDepositForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Make Deposit</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Savings Balance"
          value={formatCurrency(memberData.savingsBalance)}
          subtitle="Available balance"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Active Loans"
          value={memberData.activeLoans.toString()}
          subtitle="Loans in progress"
          icon={CreditCard}
          color="blue"
        />
        <StatsCard
          title="Monthly Growth"
          value="+12.5%"
          subtitle="Savings growth"
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Next Payment"
          value={formatCurrency(memberData.nextPaymentAmount)}
          subtitle={`Due ${new Date(memberData.nextPaymentDate).toLocaleDateString()}`}
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setShowLoanForm(true)}
                className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Apply for Loan</span>
                </div>
              </button>
              <button 
                onClick={() => setShowDepositForm(true)}
                className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Make Deposit</span>
                </div>
              </button>
              <button 
                onClick={() => setShowWithdrawalForm(true)}
                className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900">Request Withdrawal</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                onClick={() => setShowStatementModal(true)}
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Download Statement</span>
                </div>
              </button>
            </div>
          </div>

          {/* Loan Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Loan</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Original Amount</span>
                <span className="font-medium">{formatCurrency(5000000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Balance</span>
                <span className="font-medium">{formatCurrency(3500000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment</span>
                <span className="font-medium">{formatCurrency(235000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Payment</span>
                <span className="font-medium">{new Date(memberData.nextPaymentDate).toLocaleDateString()}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showLoanForm && (
        <LoanApplicationForm
          onSubmit={handleLoanSubmit}
          onCancel={() => setShowLoanForm(false)}
        />
      )}

      {showDepositForm && (
        <SavingsDepositForm
          onSubmit={handleDepositSubmit}
          onCancel={() => setShowDepositForm(false)}
        />
      )}

      {showWithdrawalForm && (
        <WithdrawalRequestForm
          onSubmit={handleWithdrawalSubmit}
          onCancel={() => setShowWithdrawalForm(false)}
          availableBalance={memberData.savingsBalance}
        />
      )}

      {showStatementModal && (
        <StatementDownloadModal
          onSubmit={handleStatementDownload}
          onCancel={() => setShowStatementModal(false)}
          memberData={memberData}
        />
      )}
    </div>
  );
}