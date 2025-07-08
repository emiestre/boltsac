import React, { useState } from 'react';
import { ApprovalConfiguration, ApprovalConfigStep } from '../../types';
import { X, Plus, Trash2, Settings, Users, DollarSign, ArrowRight } from 'lucide-react';

interface ApprovalConfigModalProps {
  onClose: () => void;
  onSave: (config: ApprovalConfiguration) => void;
  existingConfig?: ApprovalConfiguration;
}

export function ApprovalConfigModal({ onClose, onSave, existingConfig }: ApprovalConfigModalProps) {
  const [formData, setFormData] = useState({
    type: existingConfig?.type || 'loan' as 'membership' | 'loan' | 'withdrawal',
    name: existingConfig?.name || '',
    description: existingConfig?.description || '',
    isActive: existingConfig?.isActive ?? true,
    steps: existingConfig?.steps || [
      {
        level: 1,
        role: 'loan_officer',
        title: 'Initial Review',
        required: true,
        conditions: {}
      }
    ] as ApprovalConfigStep[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableRoles = [
    { value: 'loan_officer', label: 'Loan Officer' },
    { value: 'treasurer', label: 'Treasurer' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'chairperson', label: 'Chairperson' },
    { value: 'vice_chairperson', label: 'Vice Chairperson' },
    { value: 'committee_member', label: 'Committee Member' },
    { value: 'admin', label: 'Administrator' },
    { value: 'auditor', label: 'Auditor' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleStepChange = (index: number, field: string, value: any) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const handleConditionChange = (stepIndex: number, condition: string, value: any) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      conditions: {
        ...newSteps[stepIndex].conditions,
        [condition]: value || undefined
      }
    };
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    const newStep: ApprovalConfigStep = {
      level: formData.steps.length + 1,
      role: 'committee_member',
      title: `Step ${formData.steps.length + 1}`,
      required: true,
      conditions: {}
    };
    setFormData(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      // Reorder levels
      newSteps.forEach((step, i) => {
        step.level = i + 1;
      });
      setFormData(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Configuration name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.steps.length === 0) {
      newErrors.steps = 'At least one approval step is required';
    }

    formData.steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors[`step_${index}_title`] = 'Step title is required';
      }
      if (!step.role) {
        newErrors[`step_${index}_role`] = 'Step role is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const config: ApprovalConfiguration = {
        id: existingConfig?.id || Math.random().toString(36).substr(2, 9),
        ...formData,
        createdBy: 'current_user',
        createdDate: existingConfig?.createdDate || new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      onSave(config);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'membership':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'loan':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'withdrawal':
        return <ArrowRight className="w-5 h-5 text-purple-600" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600" />;
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
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {existingConfig ? 'Edit' : 'Create'} Approval Configuration
                </h2>
                <p className="text-gray-600">Configure approval workflow for requests</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['membership', 'loan', 'withdrawal'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('type', type)}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      formData.type === type
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      {getTypeIcon(type)}
                      <span className="text-xs font-medium capitalize">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={formData.isActive}
                    onChange={() => handleInputChange('isActive', true)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!formData.isActive}
                    onChange={() => handleInputChange('isActive', false)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configuration Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Standard Loan Approval Process"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe when and how this approval process should be used..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Approval Steps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Approval Steps</h3>
              <button
                type="button"
                onClick={addStep}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Step {step.level}</h4>
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Step Title *
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                          errors[`step_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Initial Review"
                      />
                      {errors[`step_${index}_title`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`step_${index}_title`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approver Role *
                      </label>
                      <select
                        value={step.role}
                        onChange={(e) => handleStepChange(index, 'role', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                          errors[`step_${index}_role`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select role</option>
                        {availableRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errors[`step_${index}_role`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`step_${index}_role`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id={`required_${index}`}
                        checked={step.required}
                        onChange={(e) => handleStepChange(index, 'required', e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`required_${index}`} className="text-sm text-gray-700">
                        This step is required (cannot be skipped)
                      </label>
                    </div>
                  </div>

                  {/* Conditions */}
                  {formData.type === 'loan' && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-3">Conditions (Optional)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Minimum Amount (UGX)
                          </label>
                          <input
                            type="number"
                            value={step.conditions?.minAmount || ''}
                            onChange={(e) => handleConditionChange(index, 'minAmount', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Maximum Amount (UGX)
                          </label>
                          <input
                            type="number"
                            value={step.conditions?.maxAmount || ''}
                            onChange={(e) => handleConditionChange(index, 'maxAmount', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="No limit"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Min. Membership Duration (months)
                          </label>
                          <input
                            type="number"
                            value={step.conditions?.membershipDuration || ''}
                            onChange={(e) => handleConditionChange(index, 'membershipDuration', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Min. Credibility Score
                          </label>
                          <input
                            type="number"
                            value={step.conditions?.credibilityScore || ''}
                            onChange={(e) => handleConditionChange(index, 'credibilityScore', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="0"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.steps && <p className="text-red-500 text-sm mt-1">{errors.steps}</p>}
          </div>

          {/* Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-3">Workflow Preview</h3>
            <div className="flex items-center space-x-2 overflow-x-auto">
              {formData.steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex-shrink-0 bg-white p-3 rounded-lg border border-blue-200 min-w-[150px]">
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-600">
                      {availableRoles.find(r => r.value === step.role)?.label}
                    </div>
                    {step.required && (
                      <div className="text-xs text-red-600 mt-1">Required</div>
                    )}
                  </div>
                  {index < formData.steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {existingConfig ? 'Update' : 'Create'} Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}