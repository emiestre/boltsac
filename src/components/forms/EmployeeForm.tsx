import React, { useState } from 'react';
import { Employee } from '../../types';
import { User, Mail, Phone, MapPin, Calendar, Upload, X, Briefcase, DollarSign, Shield } from 'lucide-react';

interface EmployeeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  employee?: Employee;
  isEdit?: boolean;
}

export function EmployeeForm({ onSubmit, onCancel, employee, isEdit = false }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    middleName: employee?.middleName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    address: employee?.address || '',
    dateOfBirth: employee?.dateOfBirth || '',
    gender: employee?.gender || '',
    maritalStatus: employee?.maritalStatus || '',
    nationalId: employee?.nationalId || '',
    
    // Employment Details
    employeeNumber: employee?.employeeNumber || '',
    position: employee?.position || '',
    department: employee?.department || '',
    employmentType: employee?.employmentType || 'full_time',
    paymentType: employee?.paymentType || 'fixed_salary',
    startDate: employee?.startDate || '',
    endDate: employee?.endDate || '',
    status: employee?.status || 'active',
    
    // Compensation
    basicSalary: employee?.basicSalary?.toString() || '',
    dailyRate: employee?.dailyRate?.toString() || '',
    payrollFrequency: employee?.payrollFrequency || 'monthly',
    
    // Emergency Contact
    emergencyContactName: employee?.emergencyContact?.name || '',
    emergencyContactPhone: employee?.emergencyContact?.phone || '',
    emergencyContactRelationship: employee?.emergencyContact?.relationship || '',
    
    // System Access
    systemRole: employee?.systemRole || '',
    
    // Documents
    avatar: null as File | null,
    contractDocument: null as File | null,
    idDocument: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const employmentTypes = [
    { value: 'full_time', label: 'Full Time', description: 'Regular full-time employee' },
    { value: 'part_time', label: 'Part Time', description: 'Part-time employee' },
    { value: 'contract', label: 'Contract', description: 'Contract-based employee' },
    { value: 'intern', label: 'Intern', description: 'Internship position' },
  ];

  const paymentTypes = [
    { value: 'fixed_salary', label: 'Fixed Salary', description: 'Monthly fixed gross pay' },
    { value: 'daily_rate', label: 'Daily Rate', description: 'Paid based on days worked' },
  ];

  const departments = [
    'Management',
    'Finance',
    'Operations',
    'Marketing',
    'Human Resources',
    'IT',
    'Customer Service',
    'Audit',
    'Legal',
    'Other'
  ];

  const systemRoles = [
    { value: '', label: 'No System Access' },
    { value: 'admin', label: 'System Administrator' },
    { value: 'member', label: 'Member Access' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'approval_officer', label: 'Approval Officer' },
    { value: 'chairperson', label: 'Chairperson' },
    { value: 'vice_chairperson', label: 'Vice Chairperson' },
    { value: 'treasurer', label: 'Treasurer' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.nationalId) newErrors.nationalId = 'National ID is required';
    } else if (step === 2) {
      if (!formData.employeeNumber) newErrors.employeeNumber = 'Employee number is required';
      if (!formData.position) newErrors.position = 'Position is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
    } else if (step === 3) {
      if (formData.paymentType === 'fixed_salary' && !formData.basicSalary) {
        newErrors.basicSalary = 'Basic salary is required for fixed salary employees';
      }
      if (formData.paymentType === 'daily_rate' && !formData.dailyRate) {
        newErrors.dailyRate = 'Daily rate is required for daily rate employees';
      }
      if (!formData.emergencyContactName) newErrors.emergencyContactName = 'Emergency contact name is required';
      if (!formData.emergencyContactPhone) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
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
      const submitData = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : undefined,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        },
        allowances: [],
        deductions: [],
        permissions: [],
        documents: [],
      };
      onSubmit(submitData);
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

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Middle Name
          </label>
          <input
            type="text"
            value={formData.middleName}
            onChange={(e) => handleInputChange('middleName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter middle name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+256-700-123456"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status
          </label>
          <select
            value={formData.maritalStatus}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Number *
          </label>
          <input
            type="text"
            value={formData.nationalId}
            onChange={(e) => handleInputChange('nationalId', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.nationalId ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter national ID number"
          />
          {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter address"
          />
        </div>
      </div>
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee Number *
          </label>
          <input
            type="text"
            value={formData.employeeNumber}
            onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.employeeNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter employee number"
          />
          {errors.employeeNumber && <p className="text-red-500 text-sm mt-1">{errors.employeeNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position *
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.position ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter position"
          />
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Employment Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {employmentTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.employmentType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('employmentType', type.value)}
            >
              <div className="font-medium text-gray-900">{type.label}</div>
              <div className="text-sm text-gray-500">{type.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date (if applicable)
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );

  const renderCompensation = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compensation & Emergency Contact</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.paymentType === type.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('paymentType', type.value)}
            >
              <div className="font-medium text-gray-900">{type.label}</div>
              <div className="text-sm text-gray-500">{type.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.paymentType === 'fixed_salary' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Salary (UGX) *
            </label>
            <input
              type="number"
              value={formData.basicSalary}
              onChange={(e) => handleInputChange('basicSalary', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.basicSalary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter basic salary"
            />
            {errors.basicSalary && <p className="text-red-500 text-sm mt-1">{errors.basicSalary}</p>}
          </div>
        )}

        {formData.paymentType === 'daily_rate' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Rate (UGX) *
            </label>
            <input
              type="number"
              value={formData.dailyRate}
              onChange={(e) => handleInputChange('dailyRate', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.dailyRate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter daily rate"
            />
            {errors.dailyRate && <p className="text-red-500 text-sm mt-1">{errors.dailyRate}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payroll Frequency
          </label>
          <select
            value={formData.payrollFrequency}
            onChange={(e) => handleInputChange('payrollFrequency', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="monthly">Monthly</option>
            <option value="bi_weekly">Bi-weekly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Emergency Contact</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter contact name"
            />
            {errors.emergencyContactName && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone *
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+256-700-123456"
            />
            {errors.emergencyContactPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship
            </label>
            <select
              value={formData.emergencyContactRelationship}
              onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="child">Child</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemAccess = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Access & Documents</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Role
        </label>
        <select
          value={formData.systemRole}
          onChange={(e) => handleInputChange('systemRole', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {systemRoles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Select if this employee should have access to the SACCO system
        </p>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Documents</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('avatar', e.target.files?.[0] || null)}
                className="hidden"
                id="avatar"
              />
              <label htmlFor="avatar" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                Upload Photo
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Document
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload('contractDocument', e.target.files?.[0] || null)}
                className="hidden"
                id="contractDocument"
              />
              <label htmlFor="contractDocument" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                Upload Contract
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Document
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('idDocument', e.target.files?.[0] || null)}
                className="hidden"
                id="idDocument"
              />
              <label htmlFor="idDocument" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                Upload ID Copy
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Employee' : 'Add New Employee'}
            </h2>
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
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderEmploymentDetails()}
          {currentStep === 3 && renderCompensation()}
          {currentStep === 4 && renderSystemAccess()}

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
                  {isEdit ? 'Update Employee' : 'Add Employee'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}