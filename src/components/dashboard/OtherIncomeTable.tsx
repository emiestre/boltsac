import React, { useState } from 'react';
import { OtherIncomeEntry } from '../../types';
import { Plus, Edit, Trash2, Eye, Check, X, Upload, Download } from 'lucide-react';

interface OtherIncomeTableProps {
  incomes: OtherIncomeEntry[];
  onAdd: (income: Omit<OtherIncomeEntry, 'id'>) => void;
  onEdit: (id: string, income: Partial<OtherIncomeEntry>) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  canEdit?: boolean;
}

export function OtherIncomeTable({ 
  incomes, 
  onAdd, 
  onEdit, 
  onDelete, 
  onVerify, 
  onReject, 
  canEdit = true 
}: OtherIncomeTableProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIncome, setSelectedIncome] = useState<OtherIncomeEntry | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status as keyof typeof classes]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      salary: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      investment: 'bg-purple-100 text-purple-800',
      rental: 'bg-orange-100 text-orange-800',
      pension: 'bg-gray-100 text-gray-800',
      freelance: 'bg-indigo-100 text-indigo-800',
      agriculture: 'bg-emerald-100 text-emerald-800',
      remittances: 'bg-pink-100 text-pink-800',
      grants: 'bg-cyan-100 text-cyan-800',
      other: 'bg-slate-100 text-slate-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category as keyof typeof colors] || colors.other}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  const calculateMonthlyAmount = (amount: number, frequency: string) => {
    switch (frequency) {
      case 'quarterly':
        return amount / 3;
      case 'annually':
        return amount / 12;
      case 'one-time':
        return 0;
      default:
        return amount;
    }
  };

  const totalMonthlyIncome = incomes
    .filter(income => income.status === 'verified')
    .reduce((sum, income) => sum + calculateMonthlyAmount(income.amount, income.frequency), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Other Income Sources</h2>
            <p className="text-sm text-gray-600">
              Total Monthly Income: <span className="font-medium text-green-600">{formatCurrency(totalMonthlyIncome)}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Categories</option>
              <option>Salary</option>
              <option>Business</option>
              <option>Investment</option>
              <option>Rental</option>
              <option>Other</option>
            </select>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Status</option>
              <option>Pending</option>
              <option>Verified</option>
              <option>Rejected</option>
            </select>
            {canEdit && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Income</span>
              </button>
            )}
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
                Source & Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount & Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Equivalent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incomes.map((income) => (
              <tr key={income.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{income.memberName}</div>
                  <div className="text-sm text-gray-500">
                    Added: {new Date(income.dateAdded).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{income.source}</div>
                  <div className="mt-1">
                    {getCategoryBadge(income.category)}
                  </div>
                  {income.description && (
                    <div className="text-sm text-gray-500 mt-1">{income.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(income.amount)}</div>
                  <div className="text-sm text-gray-500 capitalize">{income.frequency}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(calculateMonthlyAmount(income.amount, income.frequency))}
                  </div>
                  <div className="text-sm text-gray-500">per month</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(income.status)}
                  {income.status === 'verified' && income.verifiedBy && (
                    <div className="text-xs text-gray-500 mt-1">
                      by {income.verifiedBy}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {income.verified ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-xs">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">Pending</span>
                      </div>
                    )}
                  </div>
                  {income.verificationDate && (
                    <div className="text-xs text-gray-500">
                      {new Date(income.verificationDate).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedIncome(income)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {canEdit && (
                      <button
                        onClick={() => setEditingId(income.id)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    {income.status === 'pending' && canEdit && (
                      <>
                        <button
                          onClick={() => onVerify(income.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Verify"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onReject(income.id, 'Insufficient documentation')}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {canEdit && (
                      <button
                        onClick={() => onDelete(income.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      className="text-purple-600 hover:text-purple-800 transition-colors"
                      title="Download Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {incomes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Income Sources</h3>
          <p className="text-gray-500 mb-4">Start by adding external income sources for members.</p>
          {canEdit && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Income Source
            </button>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{incomes.length}</div>
            <div className="text-sm text-gray-600">Total Sources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {incomes.filter(i => i.status === 'verified').length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {incomes.filter(i => i.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalMonthlyIncome)}</div>
            <div className="text-sm text-gray-600">Monthly Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}