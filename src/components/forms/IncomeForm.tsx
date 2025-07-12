import React, { useState } from 'react';
import { DollarSign, Upload, X, FileText, AlertTriangle } from 'lucide-react';

interface IncomeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  memberId?: string;
  memberName?: string;
}

export function IncomeForm({ onSubmit, onCancel, memberId, memberName }: IncomeFormProps) {
  const [formData, setFormData] = useState({
    memberId: memberId || '',
    memberName: memberName || '',
    source: '',
    amount: '',
    frequency: 'monthly',
    category: 'salary',
    description: '',
    
    // Supporting documents
    supportingDocuments: [] as File[],
    
    // Verification details
    verificationNotes: '',
    requiresApproval: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const incomeCategories = [
    { value: 'salary', label: 'Salary/Wages', description: 'Regular employment income' },
    { value: 'business', label: 'Business Income', description: 'Income from business activities' },
    { value: 'investment', label: 'Investment Returns', description: 'Dividends, interest, capital gains' },
    { value: 'rental', label: 'Rental Income', description: 'Property rental income' },
    { value: 'pension', label: 'Pension/Retirement', description: 'Retirement benefits' },
    { value: 'freelance', label: 'Freelance/Consulting', description: 'Independent contractor income' },
    { value: 'agriculture', label: 'Agricultural Income', description: 'Farming and livestock income' },
    { value: 'remittances', label: 'Remittances', description: 'Money transfers from abroad' },
    { value: 'grants', label: 'Grants/Aid', description: 'Government or NGO grants' },
    { value: 'other', label: 'Other Sources', description: 'Other income sources' },
  ];

  const frequencies = [
    { value: 'monthly', label: 'Monthly', multiplier: 1 },
    { value: 'quarterly', label: 'Quarterly', multiplier: 0.33 },
    { value: 'annually', label: 'Annually', multiplier: 0.083 },
    { value: 'one-time', label: 'One-time', multiplier: 0 },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        supportingDocuments: [...prev.supportingDocuments, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.memberId) newErrors.memberId = 'Member selection is required';
    if (!formData.source) newErrors.source = 'Income source is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        status: 'pending',
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        verified: false,
      };
      onSubmit(submitData);
    }
  };

  const calculateMonthlyEquivalent = () => {
    const amount = parseFloat(formData.amount) || 0;
    const frequency = frequencies.find(f => f.value === formData.frequency);
    return amount * (frequency?.multiplier || 0);
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
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add Income Source</h2>
                <p className="text-gray-600">Submit external income for verification</p>
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
          {/* Member Selection */}
          {!memberId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member *
              </label>
              <select
                value={formData.memberId}
                onChange={(e) => {
                  handleInputChange('memberId', e.target.value);
                  // In a real app, you'd fetch member name here
                  handleInputChange('memberName', 'Selected Member');
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.memberId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select member</option>
                <option value="1">John Doe (MEM001)</option>
                <option value="2">Jane Smith (MEM002)</option>
                <option value="3">Peter Johnson (MEM003)</option>
                <option value="4">Mary Wilson (MEM004)</option>
                <option value="5">David Brown (MEM005)</option>
              </select>
              {errors.memberId && <p className="text-red-500 text-sm mt-1">{errors.memberId}</p>}
            </div>
          )}

          {/* Income Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Income Source *
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.source ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., ABC Company Ltd, Rental Property, Business Name"
            />
            {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Income Category *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {incomeCategories.map((category) => (
                <div
                  key={category.value}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.category === category.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('category', category.value)}
                >
                  <div className="font-medium text-gray-900">{category.label}</div>
                  <div className="text-sm text-gray-500">{category.description}</div>
                </div>
              ))}
            </div>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Amount and Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (UGX) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Equivalent */}
          {formData.amount && formData.frequency !== 'one-time' && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Monthly Equivalent</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(calculateMonthlyEquivalent())}
              </div>
              <div className="text-sm text-green-700">
                This amount will be used for loan eligibility calculations
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Provide additional details about this income source..."
            />
          </div>

          {/* Supporting Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="supportingDocs"
              />
              <label htmlFor="supportingDocs" className="cursor-pointer text-sm text-green-600 hover:text-green-800">
                Upload Supporting Documents
              </label>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG, DOC, DOCX (Max 5MB each)
              </p>
            </div>

            {formData.supportingDocuments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                {formData.supportingDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes for Verification
            </label>
            <textarea
              value={formData.verificationNotes}
              onChange={(e) => handleInputChange('verificationNotes', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Any additional information that might help with verification..."
            />
          </div>

          {/* Approval Notice */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Approval Required</span>
            </div>
            <p className="text-sm text-yellow-800">
              This income source will be submitted for approval before being added to your profile. 
              You will be notified once the verification process is complete.
            </p>
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
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}