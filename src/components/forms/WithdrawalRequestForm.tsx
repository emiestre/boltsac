import React, { useState } from 'react';
import { ArrowDownRight, AlertTriangle, X } from 'lucide-react';

interface WithdrawalRequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  availableBalance: number;
}

export function WithdrawalRequestForm({ onSubmit, onCancel, availableBalance }: WithdrawalRequestFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    withdrawalType: 'partial',
    reason: '',
    urgency: 'normal',
    paymentMethod: 'bank_transfer',
    bankAccount: '',
    mobileMoneyNumber: '',
    
    // Supporting documents
    supportingDocument: null,
    additionalInfo: '',
    
    // Acknowledgments
    understandPenalty: false,
    confirmDetails: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const withdrawalTypes = [
    { 
      value: 'partial', 
      label: 'Partial Withdrawal', 
      description: 'Withdraw part of your savings',
      penalty: '2% processing fee'
    },
    { 
      value: 'emergency', 
      label: 'Emergency Withdrawal', 
      description: 'Urgent withdrawal for emergencies',
      penalty: '5% penalty + processing fee'
    },
    { 
      value: 'full', 
      label: 'Full Withdrawal', 
      description: 'Close account and withdraw all funds',
      penalty: '10% penalty + account closure fee'
    },
  ];

  const urgencyLevels = [
    { value: 'normal', label: 'Normal (5-7 business days)', color: 'text-green-600' },
    { value: 'urgent', label: 'Urgent (2-3 business days)', color: 'text-orange-600' },
    { value: 'emergency', label: 'Emergency (Same day)', color: 'text-red-600' },
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
      newErrors.amount = 'Withdrawal amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = 'Amount exceeds available balance';
    }

    if (!formData.reason) {
      newErrors.reason = 'Reason for withdrawal is required';
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

    if (!formData.understandPenalty) {
      newErrors.understandPenalty = 'You must acknowledge the penalty terms';
    }

    if (!formData.confirmDetails) {
      newErrors.confirmDetails = 'You must confirm the withdrawal details';
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

  const calculatePenalty = () => {
    const amount = parseFloat(formData.amount) || 0;
    let penaltyRate = 0;
    
    switch (formData.withdrawalType) {
      case 'partial':
        penaltyRate = 0.02; // 2%
        break;
      case 'emergency':
        penaltyRate = 0.05; // 5%
        break;
      case 'full':
        penaltyRate = 0.10; // 10%
        break;
    }

    const penalty = amount * penaltyRate;
    const processingFee = 50000; // Fixed processing fee
    const netAmount = amount - penalty - processingFee;

    return { penalty, processingFee, netAmount };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const { penalty, processingFee, netAmount } = calculatePenalty();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowDownRight className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Withdrawal Request</h2>
                <p className="text-gray-600">Request to withdraw from your savings</p>
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
          {/* Available Balance */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Available Balance:</span>
              <span className="text-lg font-bold text-blue-900">{formatCurrency(availableBalance)}</span>
            </div>
          </div>

          {/* Withdrawal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Withdrawal Type *
            </label>
            <div className="space-y-3">
              {withdrawalTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.withdrawalType === type.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('withdrawalType', type.value)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                    <div className="text-xs text-red-600 font-medium">{type.penalty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount (UGX) *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              max={availableBalance}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg font-medium ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter amount"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Withdrawal *
            </label>
            <select
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select reason</option>
              <option value="medical_emergency">Medical Emergency</option>
              <option value="education">Education Expenses</option>
              <option value="business_investment">Business Investment</option>
              <option value="home_improvement">Home Improvement</option>
              <option value="debt_payment">Debt Payment</option>
              <option value="family_emergency">Family Emergency</option>
              <option value="other">Other</option>
            </select>
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Processing Urgency
            </label>
            <div className="space-y-2">
              {urgencyLevels.map((level) => (
                <div
                  key={level.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.urgency === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('urgency', level.value)}
                >
                  <div className={`font-medium ${level.color}`}>{level.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.paymentMethod === 'bank_transfer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('paymentMethod', 'bank_transfer')}
              >
                <div className="font-medium text-gray-900">Bank Transfer</div>
                <div className="text-sm text-gray-500">Direct to your bank account</div>
              </div>
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.paymentMethod === 'mobile_money'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('paymentMethod', 'mobile_money')}
              >
                <div className="font-medium text-gray-900">Mobile Money</div>
                <div className="text-sm text-gray-500">MTN/Airtel mobile money</div>
              </div>
            </div>
            {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
          </div>

          {/* Payment Details */}
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

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Provide additional details about your withdrawal request..."
            />
          </div>

          {/* Calculation Summary */}
          {formData.amount && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-medium text-red-900">Withdrawal Summary</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Requested Amount:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(formData.amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Penalty ({formData.withdrawalType === 'partial' ? '2' : formData.withdrawalType === 'emergency' ? '5' : '10'}%):</span>
                  <span className="font-medium text-red-600">-{formatCurrency(penalty)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(processingFee)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium text-gray-900">Net Amount:</span>
                  <span className="font-bold text-green-600">{formatCurrency(netAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Acknowledgments */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="understandPenalty"
                checked={formData.understandPenalty}
                onChange={(e) => handleInputChange('understandPenalty', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
              />
              <label htmlFor="understandPenalty" className="text-sm text-gray-700">
                I understand that withdrawal penalties and processing fees will be deducted from my withdrawal amount *
              </label>
            </div>
            {errors.understandPenalty && <p className="text-red-500 text-sm">{errors.understandPenalty}</p>}

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="confirmDetails"
                checked={formData.confirmDetails}
                onChange={(e) => handleInputChange('confirmDetails', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
              />
              <label htmlFor="confirmDetails" className="text-sm text-gray-700">
                I confirm that all the details provided are accurate and I authorize this withdrawal request *
              </label>
            </div>
            {errors.confirmDetails && <p className="text-red-500 text-sm">{errors.confirmDetails}</p>}
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
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}