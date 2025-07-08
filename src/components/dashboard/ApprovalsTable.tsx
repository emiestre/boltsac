import React from 'react';
import { Approval } from '../../types';
import { Check, X, Clock, AlertCircle, MessageSquare, Eye, Forward } from 'lucide-react';

interface ApprovalsTableProps {
  approvals: Approval[];
  onApprove: (id: string, type: string) => void;
  onReject: (id: string, type: string) => void;
  onViewDetails?: (approval: Approval) => void;
  onAddRemark?: (approval: Approval) => void;
}

export function ApprovalsTable({ approvals, onApprove, onReject, onViewDetails, onAddRemark }: ApprovalsTableProps) {
  const getTypeBadge = (type: Approval['type']) => {
    const classes = {
      membership: 'bg-blue-100 text-blue-800',
      loan: 'bg-green-100 text-green-800',
      withdrawal: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: Approval['status']) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (approval: Approval) => {
    const isUrgent = approval.type === 'withdrawal' || 
                    (approval.type === 'loan' && approval.amount && approval.amount > 5000000);
    
    if (isUrgent) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Urgent
        </span>
      );
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getApprovalFlowStatus = (approval: Approval) => {
    if (!approval.approvalFlow) return null;
    
    const currentStep = approval.approvalFlow.find(step => step.level === approval.level);
    const totalSteps = approval.approvalFlow.length;
    
    return (
      <div className="text-xs text-gray-500">
        Step {approval.level} of {totalSteps}: {currentStep?.approverName || 'Unknown'}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{approvals.filter(a => a.status === 'pending').length} pending</span>
            </div>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Types</option>
              <option>Membership</option>
              <option>Loan</option>
              <option>Withdrawal</option>
            </select>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Priorities</option>
              <option>Urgent</option>
              <option>Normal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {approvals.map((approval) => (
              <tr key={approval.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{approval.applicantName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(approval.submittedDate).toLocaleDateString()}
                  </div>
                  {approval.rejectionRemark && (
                    <div className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>Has rejection remark</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {getTypeBadge(approval.type)}
                    {getPriorityBadge(approval)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{approval.description}</div>
                  {approval.amount && (
                    <div className="text-sm text-gray-500">{formatCurrency(approval.amount)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(approval.status)}
                  {approval.status === 'rejected' && approval.rejectedBy && (
                    <div className="text-xs text-gray-500 mt-1">
                      Rejected by {approval.rejectedBy}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(approval.level / approval.maxLevel) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {approval.level}/{approval.maxLevel}
                    </span>
                  </div>
                  {getApprovalFlowStatus(approval)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {approval.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDetails?.(approval)}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors text-xs flex items-center space-x-1"
                        title="View Details"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onAddRemark?.(approval)}
                        className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg hover:bg-yellow-200 transition-colors text-xs flex items-center space-x-1"
                        title="Add Remark"
                      >
                        <MessageSquare className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onApprove(approval.id, approval.type)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onReject(approval.id, approval.type)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-xs flex items-center space-x-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                  {approval.status === 'approved' && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-xs">Approved</span>
                      {approval.approvedBy && (
                        <span className="text-xs text-gray-500">by {approval.approvedBy}</span>
                      )}
                    </div>
                  )}
                  {approval.status === 'rejected' && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <X className="w-4 h-4" />
                      <span className="text-xs">Rejected</span>
                      {approval.rejectedBy && (
                        <span className="text-xs text-gray-500">by {approval.rejectedBy}</span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {approvals.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-500">All requests have been processed.</p>
        </div>
      )}
    </div>
  );
}