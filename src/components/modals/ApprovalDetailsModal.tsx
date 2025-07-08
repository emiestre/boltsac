import React, { useState } from 'react';
import { Approval } from '../../types';
import { X, Clock, User, DollarSign, FileText, MessageSquare, Check, AlertTriangle } from 'lucide-react';

interface ApprovalDetailsModalProps {
  approval: Approval;
  onClose: () => void;
  onApprove: (id: string, remarks?: string) => void;
  onReject: (id: string, remarks: string) => void;
  onForward: (id: string, remarks: string) => void;
}

export function ApprovalDetailsModal({ 
  approval, 
  onClose, 
  onApprove, 
  onReject, 
  onForward 
}: ApprovalDetailsModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | 'forward' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const validateRemarks = () => {
    const newErrors: Record<string, string> = {};
    
    if (action === 'reject' && !remarks.trim()) {
      newErrors.remarks = 'Rejection reason is required';
    }
    
    if (action === 'forward' && !remarks.trim()) {
      newErrors.remarks = 'Forward reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateRemarks()) return;

    switch (action) {
      case 'approve':
        onApprove(approval.id, remarks || undefined);
        break;
      case 'reject':
        onReject(approval.id, remarks);
        break;
      case 'forward':
        onForward(approval.id, remarks);
        break;
    }
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'membership':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'loan':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'withdrawal':
        return <FileText className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {getTypeIcon(approval.type)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Approval Request Details</h2>
                <p className="text-gray-600">{approval.applicantName} • {approval.type}</p>
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

        <div className="p-6 space-y-6">
          {/* Request Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Request Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Applicant</div>
                <div className="font-medium">{approval.applicantName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium capitalize">{approval.type}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Submitted Date</div>
                <div className="font-medium">{new Date(approval.submittedDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                  {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                </span>
              </div>
              {approval.amount && (
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium text-lg">{formatCurrency(approval.amount)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{approval.description}</p>
          </div>

          {/* Approval Flow */}
          {approval.approvalFlow && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Approval Flow</h3>
              <div className="space-y-3">
                {approval.approvalFlow.map((step, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    step.level === approval.level ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.status === 'approved' ? 'bg-green-100 text-green-600' :
                      step.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      step.level === approval.level ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {step.level}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{step.approverName}</div>
                      <div className="text-sm text-gray-500">{step.approverRole}</div>
                      {step.remarks && (
                        <div className="text-sm text-gray-600 mt-1 italic">"{step.remarks}"</div>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      step.status === 'approved' ? 'bg-green-100 text-green-800' :
                      step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      step.level === approval.level ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status === 'pending' && step.level === approval.level ? 'Current' : step.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {approval.history && approval.history.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Approval History</h3>
              <div className="space-y-2">
                {approval.history.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      entry.action === 'approved' ? 'bg-green-100 text-green-600' :
                      entry.action === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {entry.action === 'approved' ? <Check className="w-3 h-3" /> :
                       entry.action === 'rejected' ? <X className="w-3 h-3" /> :
                       <Clock className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{entry.approverName}</span>
                        <span className="text-gray-500"> {entry.action} this request</span>
                        <span className="text-gray-400"> on {new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      {entry.remarks && (
                        <div className="text-sm text-gray-600 mt-1 italic">"{entry.remarks}"</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Rejection Remark */}
          {approval.rejectionRemark && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Previous Rejection</h3>
              </div>
              <p className="text-red-800">{approval.rejectionRemark}</p>
              {approval.rejectedBy && approval.rejectedDate && (
                <div className="text-sm text-red-600 mt-2">
                  Rejected by {approval.rejectedBy} on {new Date(approval.rejectedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          {/* Action Selection */}
          {approval.status === 'pending' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Take Action</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => setAction('approve')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    action === 'approve' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Approve</span>
                  </div>
                </button>

                <button
                  onClick={() => setAction('reject')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    action === 'reject' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Reject</span>
                  </div>
                </button>

                <button
                  onClick={() => setAction('forward')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    action === 'forward' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Forward</span>
                  </div>
                </button>
              </div>

              {action && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {action === 'approve' ? 'Approval Comments (Optional)' :
                     action === 'reject' ? 'Rejection Reason *' :
                     'Forward Reason *'}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.remarks ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={
                      action === 'approve' ? 'Add any comments about your approval...' :
                      action === 'reject' ? 'Explain why you are rejecting this request...' :
                      'Explain why you are forwarding this request...'
                    }
                  />
                  {errors.remarks && <p className="text-red-500 text-sm mt-1">{errors.remarks}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {action && approval.status === 'pending' && (
            <button
              onClick={handleSubmit}
              className={`px-6 py-3 rounded-lg text-white transition-colors ${
                action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {action === 'approve' ? 'Approve Request' :
               action === 'reject' ? 'Reject Request' :
               'Forward Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}