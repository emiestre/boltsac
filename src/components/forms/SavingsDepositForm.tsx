import React, { useState } from 'react';
import { DollarSign, Calendar, CreditCard, X } from 'lucide-react';

interface SavingsDepositFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function SavingsDepositForm({ onSubmit, onCancel }: SavingsDepositFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    depositType: 'monthly_contribution',
    paymentMethod: 'bank_transfer',
    description: '',
    scheduledDate: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
    
    // Payment details
    bankAccount: '',
    mobileMoneyNumber: '',
    referenceNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const depositTypes = [
    { value: 'monthly_contribution', label: 'Monthly Contribution', description: 'Regular monthly savings' },
    { value: 'voluntary_deposit', label: 'Voluntary Deposit', description: 'Additional savings deposit' },
    { value: 'special_savings', label: 'Special Savings', description: 'Holiday or project savings' },
    { value: 'share_capital', label: 'Share Capital', description: 'Increase share ownership' },
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'mobile_money', label: 'Mobile Money', icon: '📱' },
    { value: 'cash', label: 'Cash Deposit', icon: '💵' },
    { value: 'check', label: 'Check', icon: '📝' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount) {
      newErrors.amount = 'Deposit amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.depositType) {
      newErrors.depositType = 'Deposit type is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    if (formData.paymentMethod === 'mobile_money' && !formData.mobileMoneyNumber) {
      newErrors.mobileMoneyNumber = 'Mobile money number is required';
    }

    if (formData.paymentMethod === 'bank_transfer' && !formData.bankAccount) {
      newErrors.bankAccount = 'Bank account is required';
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

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return 'UGX 0';
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Make Deposit</h2>
                <p className="text-gray-600">Add money to your savings account</p>
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
          {/* Deposit Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Deposit Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {depositTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.depositType === type.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('depositType', type.value)}
                >
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              ))}
            </div>
            {errors.depositType && <p className="text-red-500 text-sm mt-1">{errors.depositType}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount (UGX) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg font-medium ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
              />
              {formData.amount && (
                <div className="mt-2 text-sm text-gray-600">
                  Amount: <span className="font-medium text-green-600">{formatCurrency(formData.amount)}</span>
                </div>
              )}
            </div>
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                    formData.paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('paymentMethod', method.value)}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{method.label}</div>
                </div>
              ))}
            </div>
            {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
          </div>

          {/* Payment Details */}
          {formData.paymentMethod === 'mobile_money' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Money Number *
              </label>
              <input
                type="tel"
                value={formData.mobileMoneyNumber}
                onChange={(e) => handleInputChange('mobileMoneyNumber', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.mobileMoneyNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+256-700-123456"
              />
              {errors.mobileMoneyNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileMoneyNumber}</p>}
            </div>
          )}

          {formData.paymentMethod === 'bank_transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account *
              </label>
              <select
                value={formData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.bankAccount ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select bank account</option>
                <option value="stanbic">Stanbic Bank - ****1234</option>
                <option value="centenary">Centenary Bank - ****5678</option>
                <option value="dfcu">DFCU Bank - ****9012</option>
                <option value="equity">Equity Bank - ****3456</option>
              </select>
              {errors.bankAccount && <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>}
            </div>
          )}

          {/* Scheduled Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Date (Optional)
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-sm text-gray-500 mt-1">Leave empty to process immediately</p>
          </div>

          {/* Recurring Deposit */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                Set up recurring deposit
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.recurringFrequency}
                  onChange={(e) => handleInputChange('recurringFrequency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Add a note about this deposit..."
            />
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number (Optional)
            </label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Transaction reference or receipt number"
            />
          </div>

          {/* Summary */}
          {formData.amount && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Deposit Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-green-900">{formatCurrency(formData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-green-900">
                    {depositTypes.find(t => t.value === formData.depositType)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium text-green-900">
                    {paymentMethods.find(m => m.value === formData.paymentMethod)?.label}
                  </span>
                </div>
                {formData.isRecurring && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recurring:</span>
                    <span className="font-medium text-green-900">
                      {formData.recurringFrequency.charAt(0).toUpperCase() + formData.recurringFrequency.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

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
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Process Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}