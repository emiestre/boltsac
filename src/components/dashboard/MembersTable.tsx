import React from 'react';
import { Member } from '../../types';
import { MoreVertical, Eye, Edit, Mail, Star, TrendingUp } from 'lucide-react';

interface MembersTableProps {
  members: Member[];
  onViewMember?: (member: Member) => void;
  onEditMember?: (member: Member) => void;
}

export function MembersTable({ members, onViewMember, onEditMember }: MembersTableProps) {
  const getStatusBadge = (status: Member['status']) => {
    const classes = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role?: string) => {
    if (!role || role === 'member') return null;
    
    const roleLabels: Record<string, string> = {
      chairperson: 'Chairperson',
      vice_chairperson: 'Vice Chair',
      secretary: 'Secretary',
      treasurer: 'Treasurer',
      committee_member: 'Committee',
      loan_officer: 'Loan Officer',
      marketing_officer: 'Marketing',
      auditor: 'Auditor'
    };

    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {roleLabels[role] || role}
      </span>
    );
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      notation: 'compact'
    }).format(amount);
  };

  const calculateMonthlyExternalIncome = (member: Member) => {
    return member.externalIncomes.reduce((sum, income) => {
      let monthlyAmount = income.amount;
      if (income.frequency === 'quarterly') monthlyAmount = income.amount / 3;
      if (income.frequency === 'annually') monthlyAmount = income.amount / 12;
      if (income.frequency === 'one-time') monthlyAmount = 0;
      return sum + monthlyAmount;
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Members</h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search members..."
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Roles</option>
              <option>Officers</option>
              <option>Committee</option>
              <option>General Members</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Add Member
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role & Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Financial Summary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                External Income
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credibility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => {
              const monthlyExternalIncome = calculateMonthlyExternalIncome(member);
              return (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={member.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.memberNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(member.status)}
                      {getRoleBadge(member.organizationRole)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Savings: {formatCurrency(member.savingsBalance)}</div>
                      <div className="text-gray-500">Loans: {formatCurrency(member.totalLoans)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(monthlyExternalIncome)}/mo
                      </div>
                      <div className="text-gray-500">
                        {member.externalIncomes.length} source{member.externalIncomes.length !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {member.externalIncomes.some(income => income.verified) && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Star className={`w-4 h-4 ${getCredibilityColor(member.credibilityScore)}`} />
                      <span className={`text-sm font-medium ${getCredibilityColor(member.credibilityScore)}`}>
                        {member.credibilityScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onViewMember?.(member)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEditMember?.(member)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-800 transition-colors">
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}