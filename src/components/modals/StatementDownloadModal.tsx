import React, { useState } from 'react';
import { Download, Calendar, FileText, X, Filter } from 'lucide-react';

interface StatementDownloadModalProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  memberData: any;
}

export function StatementDownloadModal({ onSubmit, onCancel, memberData }: StatementDownloadModalProps) {
  const [formData, setFormData] = useState({
    statementType: 'comprehensive',
    format: 'pdf',
    dateRange: 'last_6_months',
    customStartDate: '',
    customEndDate: '',
    includeTransactions: true,
    includeLoanDetails: true,
    includeSavingsHistory: true,
    includeExternalIncome: false,
    includeCredibilityScore: false,
    language: 'english',
    deliveryMethod: 'download',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statementTypes = [
    { 
      value: 'comprehensive', 
      label: 'Comprehensive Statement', 
      description: 'Complete financial overview including all activities',
      icon: '📊'
    },
    { 
      value: 'savings_only', 
      label: 'Savings Statement', 
      description: 'Savings deposits, withdrawals, and balance history',
      icon: '💰'
    },
    { 
      value: 'loans_only', 
      label: 'Loan Statement', 
      description: 'Loan details, payments, and outstanding balances',
      icon: '🏦'
    },
    { 
      value: 'transactions_only', 
      label: 'Transaction History', 
      description: 'All financial transactions in chronological order',
      icon: '📝'
    },
  ];

  const formats = [
    { value: 'pdf', label: 'PDF Document', icon: '📄', description: 'Best for viewing and printing' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: '📊', description: 'Best for data analysis' },
    { value: 'word', label: 'Word Document', icon: '📝', description: 'Best for editing and customization' },
    { value: 'csv', label: 'CSV File', icon: '📋', description: 'Best for importing to other systems' },
  ];

  const dateRanges = [
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'year_to_date', label: 'Year to Date' },
    { value: 'all_time', label: 'All Time' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.statementType) {
      newErrors.statementType = 'Statement type is required';
    }

    if (!formData.format) {
      newErrors.format = 'Format is required';
    }

    if (formData.dateRange === 'custom') {
      if (!formData.customStartDate) {
        newErrors.customStartDate = 'Start date is required for custom range';
      }
      if (!formData.customEndDate) {
        newErrors.customEndDate = 'End date is required for custom range';
      }
      if (formData.customStartDate && formData.customEndDate && 
          new Date(formData.customStartDate) > new Date(formData.customEndDate)) {
        newErrors.customEndDate = 'End date must be after start date';
      }
    }

    if (formData.deliveryMethod === 'email' && !formData.email) {
      newErrors.email = 'Email address is required for email delivery';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Download Statement</h2>
                <p className="text-gray-600">Generate and download your financial statement</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Statement Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Statement Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {statementTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.statementType === type.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('statementType', type.value)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.statementType && <p className="text-red-500 text-sm mt-1">{errors.statementType}</p>}
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              File Format *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formats.map((format) => (
                <div
                  key={format.value}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                    formData.format === format.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('format', format.value)}
                >
                  <div className="text-2xl mb-1">{format.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{format.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{format.description}</div>
                </div>
              ))}
            </div>
            {errors.format && <p className="text-red-500 text-sm mt-1">{errors.format}</p>}
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => handleInputChange('dateRange', range.value)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    formData.dateRange === range.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {formData.dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.customStartDate}
                    onChange={(e) => handleInputChange('customStartDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.customStartDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.customStartDate && <p className="text-red-500 text-sm mt-1">{errors.customStartDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.customEndDate}
                    onChange={(e) => handleInputChange('customEndDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.customEndDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.customEndDate && <p className="text-red-500 text-sm mt-1">{errors.customEndDate}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Content Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include in Statement
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeTransactions"
                  checked={formData.includeTransactions}
                  onChange={(e) => handleInputChange('includeTransactions', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="includeTransactions" className="text-sm text-gray-700">
                  Transaction History
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeLoanDetails"
                  checked={formData.includeLoanDetails}
                  onChange={(e) => handleInputChange('includeLoanDetails', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="includeLoanDetails" className="text-sm text-gray-700">
                  Loan Details & Payment Schedule
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeSavingsHistory"
                  checked={formData.includeSavingsHistory}
                  onChange={(e) => handleInputChange('includeSavingsHistory', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="includeSavingsHistory" className="text-sm text-gray-700">
                  Savings Growth History
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeExternalIncome"
                  checked={formData.includeExternalIncome}
                  onChange={(e) => handleInputChange('includeExternalIncome', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="includeExternalIncome" className="text-sm text-gray-700">
                  External Income Sources
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeCredibilityScore"
                  checked={formData.includeCredibilityScore}
                  onChange={(e) => handleInputChange('includeCredibilityScore', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="includeCredibilityScore" className="text-sm text-gray-700">
                  Credibility Score & Analysis
                </label>
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.deliveryMethod === 'download'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('deliveryMethod', 'download')}
              >
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Direct Download</div>
                    <div className="text-sm text-gray-500">Download immediately to your device</div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.deliveryMethod === 'email'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('deliveryMethod', 'email')}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email Delivery</div>
                    <div className="text-sm text-gray-500">Send to your email address</div>
                  </div>
                </div>
              </div>
            </div>

            {formData.deliveryMethod === 'email' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Statement Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-purple-900">
                  {statementTypes.find(t => t.value === formData.statementType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium text-purple-900">
                  {formats.find(f => f.value === formData.format)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium text-purple-900">
                  {dateRanges.find(r => r.value === formData.dateRange)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium text-purple-900">
                  {formData.deliveryMethod === 'download' ? 'Direct Download' : 'Email Delivery'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Generate Statement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}