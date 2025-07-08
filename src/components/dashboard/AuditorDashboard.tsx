import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { 
  FileText, 
  Download, 
  Eye, 
  Filter, 
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle
} from 'lucide-react';

export function AuditorDashboard() {
  const { members, loans, savings } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const auditData = {
    totalMembers: members.length,
    totalLoans: loans.reduce((sum, loan) => sum + loan.amount, 0),
    totalSavings: members.reduce((sum, member) => sum + member.savingsBalance, 0),
    pendingApprovals: 5,
    riskLoans: 2,
    complianceScore: 94
  };

  const reports = [
    {
      id: 1,
      name: 'Monthly Financial Statement',
      type: 'Financial',
      period: 'February 2024',
      status: 'Ready',
      generatedDate: '2024-02-28',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Member Activity Report',
      type: 'Membership',
      period: 'Q1 2024',
      status: 'Ready',
      generatedDate: '2024-02-25',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Loan Portfolio Analysis',
      type: 'Loans',
      period: 'February 2024',
      status: 'Ready',
      generatedDate: '2024-02-28',
      size: '3.2 MB'
    },
    {
      id: 4,
      name: 'Arrears Report',
      type: 'Risk',
      period: 'February 2024',
      status: 'Ready',
      generatedDate: '2024-02-28',
      size: '856 KB'
    }
  ];

  const auditTrail = [
    {
      id: 1,
      action: 'Loan Approved',
      user: 'Admin User',
      entity: 'Jane Smith Loan Application',
      amount: 2000000,
      timestamp: '2024-02-15 14:30:00',
      status: 'Approved'
    },
    {
      id: 2,
      action: 'Member Registration',
      user: 'Registration Officer',
      entity: 'John Doe Membership',
      amount: null,
      timestamp: '2024-02-14 10:15:00',
      status: 'Approved'
    },
    {
      id: 3,
      action: 'Savings Deposit',
      user: 'Member',
      entity: 'Mary Wilson Savings',
      amount: 500000,
      timestamp: '2024-02-13 16:45:00',
      status: 'Completed'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditor Console</h1>
          <p className="text-gray-600">Financial oversight and compliance monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{auditData.totalMembers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(auditData.totalLoans)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(auditData.totalSavings)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">{auditData.complianceScore}%</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports and Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Available Reports</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.period} • {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Audit Trail</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {auditTrail.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-1 bg-blue-100 rounded-full">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{entry.action}</p>
                    <span className="text-xs text-gray-500">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{entry.entity}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">By: {entry.user}</p>
                    {entry.amount && (
                      <p className="text-xs font-medium text-green-600">
                        {formatCurrency(entry.amount)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Risk Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{auditData.riskLoans}</p>
            <p className="text-sm text-gray-600">High Risk Loans</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{auditData.pendingApprovals}</p>
            <p className="text-sm text-gray-600">Pending Approvals</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{auditData.complianceScore}%</p>
            <p className="text-sm text-gray-600">Compliance Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}