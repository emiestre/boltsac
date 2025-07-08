import React, { useState } from 'react';
import { DollarSign, Calendar, FileText, Calculator, X, Upload } from 'lucide-react';

interface LoanApplicationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function LoanApplicationForm({ onSubmit, onCancel }: LoanApplicationFormProps) {
  const [formData, setFormData] = useState({
    // Loan Details
    loanType: '',
    amount: '',
    purpose: '',
    term: '',
    preferredRate: '',
    
    // Repayment Information
    repaymentMethod: 'monthly',
    repaymentSource: '',
    collateralType: '',
    collateralValue: '',
    
    // Guarantor Information
    guarantor1Name: '',
    guarantor1Phone: '',
    guarantor1Relationship: '',
    guarantor1MemberNumber: '',
    guarantor2Name: '',
    guarantor2Phone: '',
    guarantor2Relationship: '',
    guarantor2MemberNumber: '',
    
    // Financial Information
    monthlyIncome: '',
    monthlyExpenses: '',
    otherLoans: '',
    bankStatement: null,
    salarySlip: null,
    businessLicense: null,
    
    // Additional Information
    additionalInfo: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const loanTypes = [
    { value: 'personal', label: 'Personal Loan', rate: '12%', maxAmount: '10,000,000' },
    { value: 'business', label: 'Business Loan', rate: '10%', maxAmount: '50,000,000' },
    { value: 'emergency', label: 'Emergency Loan', rate: '15%', maxAmount: '5,000,000' },
    { value: 'education', label: 'Education Loan', rate: '8%', maxAmount: '20,000,000' },
    { value: 'agriculture', label: 'Agriculture Loan', rate: '9%', maxAmount: '30,000,000' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.preferredRate) / 100 / 12 || 0;
    const term = parseInt(formData.term) || 0;
    
    if (principal && rate && term) {
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
      return monthlyPayment.toLocaleString('en-UG', { style: 'currency', currency: 'UGX' });
    }
    return 'UGX 0';
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.loanType) newErrors.loanType = 'Loan type is required';
      if (!formData.amount) newErrors.amount = 'Loan amount is required';
      if (!formData.purpose) newErrors.purpose = 'Loan purpose is required';
      if (!formData.term) newErrors.term = 'Loan term is required';
    } else if (step === 2) {
      if (!formData.repaymentSource) newErrors.repaymentSource = 'Repayment source is required';
      if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required';
      if (!formData.monthlyExpenses) newErrors.monthlyExpenses = 'Monthly expenses is required';
    } else if (step === 3) {
      if (!formData.guarantor1Name) newErrors.guarantor1Name = 'First guarantor name is required';
      if (!formData.guarantor1Phone) newErrors.guarantor1Phone = 'First guarantor phone is required';
    } else if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <React.Fragment key={i}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            i + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 h-1 ${
              i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderLoanDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loanTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.loanType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('loanType', type.value)}
            >
              <div className="font-medium text-gray-900">{type.label}</div>
              <div className="text-sm text-gray-500">Rate: {type.rate} | Max: UGX {type.maxAmount}</div>
            </div>
          ))}
        </div>
        {errors.loanType && <p className="text-red-500 text-sm mt-1">{errors.loanType}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (UGX) *
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter loan amount"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (Months) *
          </label>
          <select
            value={formData.term}
            onChange={(e) => handleInputChange('term', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.term ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select term</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="18">18 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="48">48 months</option>
            <option value="60">60 months</option>
          </select>
          {errors.term && <p className="text-red-500 text-sm mt-1">{errors.term}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Purpose *
        </label>
        <textarea
          value={formData.purpose}
          onChange={(e) => handleInputChange('purpose', e.target.value)}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.purpose ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe the purpose of this loan"
        />
        {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
      </div>

      {formData.amount && formData.term && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Loan Calculator</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Estimated Monthly Payment:</span>
              <div className="font-bold text-blue-900">{calculateMonthlyPayment()}</div>
            </div>
            <div>
              <span className="text-gray-600">Total Interest:</span>
              <div className="font-bold text-blue-900">
                {formData.loanType && loanTypes.find(t => t.value === formData.loanType)?.rate}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income (UGX) *
          </label>
          <input
            type="number"
            value={formData.monthlyIncome}
            onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter monthly income"
          />
          {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Expenses (UGX) *
          </label>
          <input
            type="number"
            value={formData.monthlyExpenses}
            onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.monthlyExpenses ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter monthly expenses"
          />
          {errors.monthlyExpenses && <p className="text-red-500 text-sm mt-1">{errors.monthlyExpenses}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repayment Source *
          </label>
          <select
            value={formData.repaymentSource}
            onChange={(e) => handleInputChange('repaymentSource', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.repaymentSource ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select source</option>
            <option value="salary">Salary</option>
            <option value="business">Business Income</option>
            <option value="investments">Investments</option>
            <option value="other">Other</option>
          </select>
          {errors.repaymentSource && <p className="text-red-500 text-sm mt-1">{errors.repaymentSource}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Loans (UGX)
          </label>
          <input
            type="number"
            value={formData.otherLoans}
            onChange={(e) => handleInputChange('otherLoans', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Total outstanding loans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collateral Type
          </label>
          <select
            value={formData.collateralType}
            onChange={(e) => handleInputChange('collateralType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select collateral</option>
            <option value="property">Property/Land</option>
            <option value="vehicle">Vehicle</option>
            <option value="savings">Savings Account</option>
            <option value="shares">Shares/Stocks</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collateral Value (UGX)
          </label>
          <input
            type="number"
            value={formData.collateralValue}
            onChange={(e) => handleInputChange('collateralValue', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Estimated value"
          />
        </div>
      </div>

      {formData.monthlyIncome && formData.monthlyExpenses && (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Financial Summary</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Net Income:</span>
              <div className="font-bold text-green-900">
                UGX {(parseInt(formData.monthlyIncome) - parseInt(formData.monthlyExpenses)).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Debt-to-Income:</span>
              <div className="font-bold text-green-900">
                {formData.amount ? Math.round((parseFloat(calculateMonthlyPayment().replace(/[^\d]/g, '')) / parseInt(formData.monthlyIncome)) * 100) : 0}%
              </div>
            </div>
            <div>
              <span className="text-gray-600">Affordability:</span>
              <div className={`font-bold ${
                formData.monthlyIncome && formData.monthlyExpenses && 
                (parseInt(formData.monthlyIncome) - parseInt(formData.monthlyExpenses)) > 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {formData.monthlyIncome && formData.monthlyExpenses && 
                 (parseInt(formData.monthlyIncome) - parseInt(formData.monthlyExpenses)) > 0 ? 'Good' : 'Poor'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGuarantors = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Guarantor Information</h3>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> You need at least one guarantor who is an active SACCO member. 
          Guarantors will be notified and must approve your loan application.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Primary Guarantor *</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.guarantor1Name}
              onChange={(e) => handleInputChange('guarantor1Name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.guarantor1Name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter guarantor name"
            />
            {errors.guarantor1Name && <p className="text-red-500 text-sm mt-1">{errors.guarantor1Name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.guarantor1Phone}
              onChange={(e) => handleInputChange('guarantor1Phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.guarantor1Phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+256-700-123456"
            />
            {errors.guarantor1Phone && <p className="text-red-500 text-sm mt-1">{errors.guarantor1Phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Number
            </label>
            <input
              type="text"
              value={formData.guarantor1MemberNumber}
              onChange={(e) => handleInputChange('guarantor1MemberNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="SACCO member number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship
            </label>
            <select
              value={formData.guarantor1Relationship}
              onChange={(e) => handleInputChange('guarantor1Relationship', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="colleague">Colleague</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Secondary Guarantor (Optional)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.guarantor2Name}
              onChange={(e) => handleInputChange('guarantor2Name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter guarantor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.guarantor2Phone}
              onChange={(e) => handleInputChange('guarantor2Phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="+256-700-123456"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Number
            </label>
            <input
              type="text"
              value={formData.guarantor2MemberNumber}
              onChange={(e) => handleInputChange('guarantor2MemberNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="SACCO member number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship
            </label>
            <select
              value={formData.guarantor2Relationship}
              onChange={(e) => handleInputChange('guarantor2Relationship', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="colleague">Colleague</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Statement (3 months)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('bankStatement', e.target.files?.[0] || null)}
              className="hidden"
              id="bankStatement"
            />
            <label htmlFor="bankStatement" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
              Upload Statement
            </label>
            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Slip (Latest)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('salarySlip', e.target.files?.[0] || null)}
              className="hidden"
              id="salarySlip"
            />
            <label htmlFor="salarySlip" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
              Upload Salary Slip
            </label>
            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business License (If applicable)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('businessLicense', e.target.files?.[0] || null)}
              className="hidden"
              id="businessLicense"
            />
            <label htmlFor="businessLicense" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
              Upload License
            </label>
            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Any additional information that might help with your loan application..."
        />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-md font-medium text-gray-900 mb-4">Terms and Conditions</h4>
        <div className="text-sm text-gray-700 space-y-2 mb-4">
          <p>• I understand that this loan application is subject to approval by the SACCO committee.</p>
          <p>• I agree to the interest rates and terms as specified by the SACCO.</p>
          <p>• I understand that failure to repay may result in penalties and affect my membership status.</p>
          <p>• I authorize the SACCO to verify the information provided in this application.</p>
          <p>• I understand that my guarantors will be contacted for verification.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
            I agree to the terms and conditions *
          </label>
        </div>
        {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Loan Application</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {renderStepIndicator()}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {currentStep === 1 && renderLoanDetails()}
          {currentStep === 2 && renderFinancialInfo()}
          {currentStep === 3 && renderGuarantors()}
          {currentStep === 4 && renderDocuments()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}