import React, { useState } from 'react';
import { Member } from '../types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  Star,
  TrendingUp,
  Download,
  Edit,
  X,
  FileText,
  CreditCard
} from 'lucide-react';

interface MemberProfileProps {
  member: Member;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function MemberProfile({ member, onClose, onEdit, canEdit = false }: MemberProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateMonthlyExternalIncome = () => {
    return member.externalIncomes.reduce((sum, income) => {
      let monthlyAmount = income.amount;
      if (income.frequency === 'quarterly') monthlyAmount = income.amount / 3;
      if (income.frequency === 'annually') monthlyAmount = income.amount / 12;
      if (income.frequency === 'one-time') monthlyAmount = 0;
      return sum + monthlyAmount;
    }, 0);
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRoleBadge = (role?: string) => {
    if (!role || role === 'member') return 'General Member';
    
    const roleLabels: Record<string, string> = {
      chairperson: 'Chairperson',
      vice_chairperson: 'Vice Chairperson',
      secretary: 'Secretary',
      treasurer: 'Treasurer',
      committee_member: 'Committee Member',
      loan_officer: 'Loan Officer',
      marketing_officer: 'Marketing Officer',
      auditor: 'Internal Auditor'
    };

    return roleLabels[role] || role;
  };

  const downloadProfile = (format: string) => {
    // Mock download functionality
    console.log(`Downloading ${member.name}'s profile as ${format}`);
    // In a real app, this would generate and download the file
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'savings', label: 'Savings Flow', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  // Mock monthly savings flow data
  const mockSavingsFlow = [
    { month: 'Jan 2024', deposits: 500000, withdrawals: 0, netSavings: 500000, balance: 2000000 },
    { month: 'Feb 2024', deposits: 750000, withdrawals: 200000, netSavings: 550000, balance: 2550000 },
    { month: 'Mar 2024', deposits: 500000, withdrawals: 0, netSavings: 500000, balance: 3050000 },
    { month: 'Apr 2024', deposits: 600000, withdrawals: 100000, netSavings: 500000, balance: 3550000 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={member.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                alt={member.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                <p className="text-gray-600">{member.memberNumber} • {getRoleBadge(member.organizationRole)}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === 'active' ? 'bg-green-100 text-green-800' :
                    member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    member.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className={`w-4 h-4 ${getCredibilityColor(member.credibilityScore)}`} />
                    <span className={`text-sm font-medium ${getCredibilityColor(member.credibilityScore)}`}>
                      {member.credibilityScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="p-2">
                    {['PDF', 'Excel', 'Word', 'CSV'].map((format) => (
                      <button
                        key={format}
                        onClick={() => downloadProfile(format.toLowerCase())}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Download as {format}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
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
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{member.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium">{member.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Member Since</div>
                      <div className="font-medium">{new Date(member.joinDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {member.dateOfBirth && (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Date of Birth</div>
                        <div className="font-medium">{new Date(member.dateOfBirth).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}
                  {member.occupation && (
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Occupation</div>
                        <div className="font-medium">{member.occupation}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">Sarah Johnson</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">+256-700-987654</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Relationship</div>
                    <div className="font-medium">Spouse</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">Savings Balance</div>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(member.savingsBalance)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Total Loans</div>
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(member.totalLoans)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="text-sm text-gray-600">Monthly External Income</div>
                      <div className="text-2xl font-bold text-purple-600">{formatCurrency(calculateMonthlyExternalIncome())}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* External Income Sources */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">External Income Sources</h3>
                <div className="space-y-3">
                  {member.externalIncomes.map((income) => (
                    <div key={income.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{income.source}</div>
                        <div className="text-sm text-gray-500">{income.category} • {income.frequency}</div>
                        {income.description && (
                          <div className="text-sm text-gray-600 mt-1">{income.description}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{formatCurrency(income.amount)}</div>
                        <div className="flex items-center space-x-2">
                          {income.verified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'savings' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Savings Flow</h3>
              <div className="space-y-4">
                {mockSavingsFlow.map((flow, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{flow.month}</div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-gray-500">Deposits</div>
                        <div className="font-medium text-green-600">{formatCurrency(flow.deposits)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Withdrawals</div>
                        <div className="font-medium text-red-600">{formatCurrency(flow.withdrawals)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Net Savings</div>
                        <div className={`font-medium ${flow.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(flow.netSavings)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Balance</div>
                        <div className="font-medium text-blue-600">{formatCurrency(flow.balance)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Member Statement',
                  'Loan History',
                  'Savings Report',
                  'Transaction History',
                  'Tax Documents',
                  'Membership Certificate'
                ].map((doc) => (
                  <button
                    key={doc}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{doc}</div>
                        <div className="text-sm text-gray-500">Download PDF</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}